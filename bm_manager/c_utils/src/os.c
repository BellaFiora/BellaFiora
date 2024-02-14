#include "os.h"

#include <sys/mman.h>
#include <sys/stat.h>
#include <sys/resource.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <errno.h>
#include <stdlib.h>

#include "debug.h"

DirectoryCounts directory_count(const char *dirname) {
	DirectoryCounts r = { .nb_files = 0, .nb_directories = 0 };
	struct dirent *entry;
	DIR *directory = opendir(dirname);
	if (!directory) {
		ereport("opendir failed to open the %s directory", dirname);
		return r;
	}
	while ((entry = readdir(directory))) {
		if (entry->d_type == DT_REG)
			r.nb_files++;
		else if (entry->d_type == DT_DIR) {
			if (strcmp(entry->d_name, ".") != 0 && strcmp(entry->d_name, "..") != 0)
				r.nb_directories++;
		}
	}
	closedir(directory);
	return r;
}

FILES* open_files(const char* dirname) {
	// check nb files to open
	struct rlimit rlim;
	if (getrlimit(RLIMIT_NOFILE, &rlim)) {
		ereport("getrlimit failed");
		return NULL;
	}
	DirectoryCounts counts = directory_count(dirname);
	if (counts.nb_files > rlim.rlim_cur) {
		ereport("%zu files to open in %s (limit is %zu)", counts.nb_files, dirname, rlim.rlim_cur);
		return NULL;
	}
	// init FILES struct
	FILES* r = calloc(1, sizeof(FILES));
	if (!r) {
		ereport("calloc failed");
		return NULL;
	}
	r->dirname = dirname;
	size_t capacity = 1024;
	r->files = calloc(1, capacity * sizeof(FILE*));
	r->filenames = calloc(1, capacity * sizeof(char*));
	if (!r->files || !r->filenames) {
		ereport("calloc failed");
		free(r);
		return NULL;
	}
	r->nb_files = 0;
	// open directory
	DIR* directory = opendir(dirname);
	if (!directory) {
		ereport("opendir failed to open the %s directory", dirname);
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
				ereport("readdir failed");
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
				ereport("realloc failed");
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
			ereport("fopen failed to open %s (%s)", path, strerror(errno));
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
			ereport("strdup failed");
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
	if (tmp1) r->files = tmp1;
	if (tmp2) r->filenames = tmp2;
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

FFILE* mmap_file(const char* path) {
	// Open the file
	int fd = open(path, O_RDONLY);
	if (fd == -1) {
		ereport("open failed");
		return NULL;
	}
	struct stat fstats;
	if (fstat(fd, &fstats) == -1) {
		ereport("fstat failed");
		close(fd);
		return NULL;
	}
	char* content = mmap(NULL, fstats.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
	close(fd);
	if (content == MAP_FAILED) {
		ereport("mmap failed");
		return NULL;
	}
	FFILE* r = calloc(1, sizeof(FFILE));
	if (!r) {
		ereport("calloc failed");
		return NULL;
	}
	r->content = content;
	r->size = fstats.st_size;
	return r;
}

void munmap_file(FFILE* file) {
	if (file == NULL) return;
	if (file->content != NULL)
		if (munmap(file->content, file->size) == -1)
			ereport("munmap failed");
	free(file);
}
