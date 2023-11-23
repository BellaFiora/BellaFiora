#include "math.h"

Range* divide(size_t n, size_t nb) {
	if (!nb) {
		fprintf(stderr, "divide: division by zero\n");
		errno = EINVAL;
		return NULL;
	}
	if (nb > n) {
	    fprintf(stderr, "divide: range size is 0\n");
		errno = EINVAL;
		return NULL;
	}
	Range* ranges = (Range*)calloc(nb, sizeof(Range));
	if (!ranges) {
		fprintf(stderr, "divide: calloc failed\n");
		return NULL;
	}
	size_t size = n / nb;
	size_t current = 0;
	for (size_t i = 0; i < nb - 1; i++) {
		ranges[i].start = current;
		ranges[i].end = current + size;
		current += size;
	}
	ranges[nb - 1].start = current;
	ranges[nb - 1].end = n;
	return ranges;
}

void print_ranges(Range* ranges, size_t nb) {
	if (!ranges)
		return;
	for (size_t i = 0; i < nb; i++) {
		printf("[%zu-%zu] ", ranges[i].start, ranges[i].end);
	}
	printf("\n");
}
