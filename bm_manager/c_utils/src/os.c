#include "os.h"

DirectoryCounts directory_count(const char *dirname) {
	struct DirectoryCounts r = {0, 0};
	struct dirent *entry;
	DIR *directory = opendir(dirname);
	if (!directory) {
		fprintf(stderr, "directory_count: opendir failed to open the %s directory\n", dirname);
		return r;
	}
	while ((entry = readdir(directory))) {
		if (entry->d_type == DT_REG)
			r.fileCount++;
		else if (entry->d_type == DT_DIR) {
			if (strcmp(entry->d_name, ".") != 0 && strcmp(entry->d_name, "..") != 0)
				r.directoryCount++;
		}
	}
	closedir(directory);
	return r;
}

FILES* open_files(const char* dirname) {
	// init FILES struct
	FILES* r = calloc(1, sizeof(FILES));
	if (!r)
	{
		fprintf(stderr, "open_files: calloc failed\n");
		return NULL;
	}
	r->dirname = dirname;
	size_t capacity = 1024;
	r->files = calloc(1, capacity * sizeof(FILE*));
	r->filenames = calloc(1, capacity * sizeof(char*));
	if (!r->files || !r->filenames) {
		fprintf(stderr, "open_files: calloc failed\n");
		free(r);
		return NULL;
	}
	r->nb_files = 0;
	// open directory
	DIR* directory = opendir(dirname);
	if (!directory) {
		fprintf(stderr, "open_files: opendir failed to open the %s directory\n", dirname);
		free(r->files);
		free(r->filenames);
		free(r);
		return NULL;
	}
	struct dirent* entry = NULL;
	char path[1048576]; // 2**20
	FILE** tmp1 = NULL;
	char** tmp2 = NULL;
	while (1) {
		// read filenames in directory
		errno = 0;
		if (!(entry = readdir(directory))) {
			if (errno) {
				fprintf(stderr, "open_files: readdir failed\n");
				for (size_t i = 0; i < r->nb_files; i++) {
					fclose(r->files[i]);
					free(r->filenames[i]);
				}
				free(r->files);
				free(r->filenames);
				free(r);
				closedir(directory);
				return NULL;
			}
			break;
		}
		if (entry->d_type != DT_REG)
			// not a regular file
			continue;
		// resize arrays
		if (r->nb_files >= capacity) {
			capacity *= 2;
			tmp1 = realloc(r->files, capacity * sizeof(FILE*));
			tmp2 = realloc(r->filenames, capacity * sizeof(char*));
			if (!tmp1 || !tmp2) {
				fprintf(stderr, "open_files: realloc failed\n");
				for (size_t i = 0; i < r->nb_files; i++) {
					fclose(r->files[i]);
					free(r->filenames[i]);
				}
				free(r->files);
				free(r->filenames);
				free(r);
				closedir(directory);
				return NULL;
			}
			r->files = tmp1;
			r->filenames = tmp2;
		}
		sprintf(path, "%s/%s", dirname, entry->d_name);
		r->files[r->nb_files] = fopen(path, "rb");
		if (!r->files[r->nb_files]) {
			fprintf(stderr, "open_files: fopen failed to open %s (%s)\n", path, strerror(errno));
			for (size_t i = 0; i < r->nb_files; i++) {
				fclose(r->files[i]);
				free(r->filenames[i]);
			}
			free(r->files);
			free(r->filenames);
			free(r);
			closedir(directory);
			return NULL;
		}
		r->filenames[r->nb_files] = strdup(entry->d_name);
		if (!r->filenames[r->nb_files]) {
			fprintf(stderr, "open_files: strdup failed\n");
			for (size_t i = 0; i < r->nb_files; i++) {
				fclose(r->files[i]);
				free(r->filenames[i]);
			}
			free(r->files);
			free(r->filenames);
			free(r);
			closedir(directory);
			return NULL;
		}
		r->nb_files++;
	}
	closedir(directory);
	tmp1 = realloc(r->files, r->nb_files * sizeof(FILE*));
	tmp2 = realloc(r->filenames, r->nb_files * sizeof(char*));
	if (tmp1)
		r->files = tmp1;
	if (tmp2)
		r->filenames = tmp2;
	return r;
}

void close_files(FILES* files) {
	if (!files)
		return;
	for (size_t i = 0; i < files->nb_files; i++) {
		fclose(files->files[i]);
		free(files->filenames[i]);
	}
	free(files->files);
	free(files->filenames);
	free(files);
}
