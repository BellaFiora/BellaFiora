#ifndef OS_UTILS_H
#define OS_UTILS_H

#include <sys/mman.h>
#include <sys/stat.h>
#include <sys/resource.h>
#include <fcntl.h>
#include <unistd.h>
#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

typedef struct {
	size_t nb_files;
	size_t nb_directories;
} DirectoryCounts;

DirectoryCounts directory_count(const char *dirname);

typedef struct {
	const char* dirname;
	FILE** files;
	char** filenames;
	size_t nb_files;
} FILES;

FILES* open_files(const char* dirname);
void close_files(FILES* files);

typedef struct {
    char* content;
    size_t size;
} FFILE;

FFILE* mmap_file(const char* path);
void munmap_file(FFILE* file);

#endif
