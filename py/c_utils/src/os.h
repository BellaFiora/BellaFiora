#ifndef OS_UTILS_H
#define OS_UTILS_H

#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

typedef struct {
	const char* dirname;
	FILE** files;
	char** filenames;
	size_t nb_files;
} FILES;

FILES* open_files(const char* dirname);
void close_files(FILES* files);

#endif
