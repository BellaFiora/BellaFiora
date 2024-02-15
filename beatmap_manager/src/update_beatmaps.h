#ifndef UPDATE_BEATMAPS_H
#define UPDATE_BEATMAPS_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include <pthread.h>
#include "../jansson-2.14/src/jansson.h"

#include "../c_utils/all.h"

struct ThreadData {
	size_t start;
	size_t end;
	DIR* bmsets;
	sQueue* q;
	pthread_mutex_t lock;
};

// protos_flag
void* download_beatmaps(void* arg);
void* scan_beatmapsets(void* arg);
int update_beatmaps(void);

#endif
