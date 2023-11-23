#ifndef UPDATE_BEATMAPS_H
#define UPDATE_BEATMAPS_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include <pthread.h>
#include <jansson.h>

#include "../c_utils/src/all.h"

struct ThreadData {
	size_t start;
	size_t end;
	FILES* bmsets;
	sQueue* q;
	pthread_mutex_t lock;
};

int update_beatmaps(void);

#endif
