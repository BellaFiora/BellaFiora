#include "update_beatmaps.h"

size_t nb_beatmaps_downloaded = 0;

void* download_beatmaps(void* arg) {
	sQueue* q = arg;
	size_t n = 0;
	size_t tmp = 0;
	FILE* file = NULL;
	char* bmid = NULL;
	char buffer[1024] = { 0 };
	while (1) {
		n = q->size;
		if (n == 0) {
			// no bmid has been found yet by the workers
			sleep(1);
			continue;
		}
		bmid = squeue_pop(q);
		if (!strcmp(bmid, "done")) {
			// all workers have terminated
			break;
		}
		n--;
		tmp = n * 1.2;
		// compute ETA
		int hours_left = tmp / 3600;
		int minutes_left = (tmp / 60) - (hours_left * 60);
		sprintf(buffer, "%dh%02d", hours_left, minutes_left);
		// print ETA
		printf("%zu maps left to download (%s)\n", n, buffer);
		sprintf(buffer, "https://osu.ppy.sh/osu/%s", bmid);
		// make request
		fflush(stderr);
		curl_request("GET", buffer);
		sprintf(buffer, "beatmaps/%s.osu", bmid);
		// save response
		if ((file = fopen(buffer, "wb+"))) {
			if (fwrite(curl_response.data, curl_response.size, 1, file))
				nb_beatmaps_downloaded++;
			else
				fprintf(stderr, "download_beatmaps: fwrite failed to write to %s.osu\n", bmid);
			fclose(file);
		}
		else
			fprintf(stderr, "download_beatmaps: fopen failed to create %s.osu\n", bmid);
		sleep(1);
	}
	return NULL;
}

#define scan_beatmapsets_check(test, error_message) \
	if (test) {\
		fprintf(stderr, "%s: %s\n", __func__, error_message);\
		if (bmsets) closedir(bmsets);\
		if (bmset_file) munmap_file(bmset_file);\
		return NULL;\
	}

void* scan_beatmapsets(void* arg) {
	sQueue* q = arg;
	json_t* tmp = NULL;
	size_t index = 0;
	json_t* bm = NULL;
	FFILE* bmset_file = NULL;
	char bm_filename[100] = { 0 };
	DIR* bmsets = opendir("beatmapsets");
	scan_beatmapsets_check(!bmsets, "opendir failed");
	do {
		errno = 0;
		struct dirent* entry = readdir(bmsets);
		if (!entry) {
			scan_beatmapsets_check(errno, "readdir failed");
			break;
		}
		if (entry->d_type != DT_REG) continue;
		bmset_file = mmap_file(entry->d_name);
		scan_beatmapsets_check(!bmset_file, "mmap_file failed");
		// parse content
		json_t* bmset = json_loads(bmset_file->content, 0, NULL);
		if (!bmset) {
			fprintf(stderr, "scan_beatmapsets: %s failed, bad json\n", entry->d_name);
			continue;
		}
		if (json_is_null(bmset)) {
			fprintf(stderr, "scan_beatmapsets: %s failed, null json\n", entry->d_name);
			json_decref(bmset);
			continue;
		}
		// seek for new beatmap ids
		json_array_foreach(bmset, index, bm) {
			if (!(tmp = json_object_get(bm, "beatmap_id"))) {
				fprintf(stderr, "scan_beatmapsets: no beatmap_id in %zuth beatmap of %s\n", index, entry->d_name);
				continue;
			}
			const char* bmid = json_string_value(tmp);
			if (!bmid) {
				fprintf(stderr, "scan_beatmapsets: null beatmap_id in %zuth beatmap of %s\n", index, entry->d_name);
				continue;
			}
			sprintf(bm_filename, "beatmaps/%s.osu", bmid);
			if (access(bm_filename, F_OK) != -1)
				// bmid already downloaded
				continue;
			// give it to the download_beatmaps thread
			squeue_push(q, bmid);
		}
		// release memory
		json_decref(bmset);
	} while (1);
	closedir(bmsets);
	if (bmset_file) munmap_file(bmset_file);
	return NULL;
}

#define update_beatmaps_check(test, error_message) \
	if (test) {\
		fprintf(stderr, "%s: %s\n", __func__, error_message);\
		if (q) free_squeue(q);\
		if (dl_thread) pthread_cancel(dl_thread);\
		if (scan_thread) pthread_cancel(scan_thread);\
		return 1;\
	}

int update_beatmaps(void) {
	sQueue* q = new_squeue(1024);
	pthread_t dl_thread = 0;
	pthread_t scan_thread = 0;
	update_beatmaps_check(!q, "new_squeue failed");
	update_beatmaps_check(pthread_create(&dl_thread, NULL, download_beatmaps, q), "pthread_create failed");
	update_beatmaps_check(pthread_create(&scan_thread, NULL, scan_beatmapsets, q), "pthread_create failed");
	printf("updating beatmaps...\n");
	int st = time(NULL);
	update_beatmaps_check(pthread_join(scan_thread, NULL), "pthread_join failed");
	printf("took %ds to find new beatmaps\n", (int)(time(NULL) - st));
	squeue_push(q, "done");
	update_beatmaps_check(pthread_join(dl_thread, NULL), "pthread_join failed");
	printf("took %ds to download new beatmaps\n", (int)(time(NULL) - st));
	free_squeue(q);
	printf("%zu new beatmaps were downloaded\n", nb_beatmaps_downloaded);
	return 0;
}
