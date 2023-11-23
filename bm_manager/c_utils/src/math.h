#ifndef MATH_UTILS_H
#define MATH_UTILS_H

#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

typedef struct {
	size_t start;
	size_t end;
} Range;

// return b if a == b
#define min(a, b) (((a) >= (b)) ? (b) : (a))
#define max(a, b) (((a) > (b)) ? (a) : (b))
// the returned pointer must be freed
Range* divide(size_t n, size_t nb);

#endif
