#include "queue.h"

// common bits

#define NULL_CHECK(return_value) \
	if (!q) \
	{ \
		fprintf(stderr, "%s: null queue\n", __func__); \
		errno = ENOMEM; \
		return return_value; \
	}

#define SAFE_NEW(queue_type, data_type) \
	queue_type* q = calloc(1, sizeof(queue_type)); \
	if (!q) \
	{ \
		fprintf(stderr, "%s: calloc failed\n", __func__); \
		errno = ENOMEM; \
		return NULL; \
	} \
	q->elements = calloc(1, initial_capacity * sizeof(data_type)); \
	if (!q->elements) \
	{ \
		fprintf(stderr, "%s: calloc failed\n", __func__); \
		errno = ENOMEM; \
		free(q); \
		return NULL; \
	}

#define RISKY_NEW(queue_type, data_type) \
	queue_type* q = calloc(1, sizeof(queue_type)); \
	q->elements = calloc(1, initial_capacity * sizeof(data_type));

#define RESIZE_QUEUE(data_type) \
	{ \
		size_t new_capacity = q->capacity * 2; \
		data_type* new_elements = calloc(1, new_capacity * sizeof(data_type)); \
		if (!new_elements) { \
			fprintf(stderr, "%s: calloc failed\n", __func__); \
			errno = ENOMEM; \
			return; \
		} \
		for (size_t i = 0; i < q->size; ++i) \
			new_elements[i] = q->elements[(q->start + i) % q->capacity]; \
		free(q->elements); \
		q->elements = new_elements; \
		q->capacity = new_capacity; \
		q->start = 0; \
		q->end = q->size; \
	}

// void* Queue

Queue* new_queue(size_t initial_capacity) {
	
#ifdef QUEUE_MEM_CHECKS
	SAFE_NEW(Queue, void*);
#else
	RISKY_NEW(Queue, void*);
#endif
	
	q->size = 0;
	q->capacity = initial_capacity;
	q->start = 0;
	q->end = 0;
	return q;
}

void queue_push(Queue* q, const void* element) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	if (q->size == q->capacity)
		RESIZE_QUEUE(void*);
	q->elements[q->end] = (void*)element;
	q->end = (q->end + 1) % q->capacity;
	q->size = q->end - q->start;
}

void* queue_pop(Queue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK(NULL);
#endif

	if (q->size == 0) {
		fprintf(stderr, "queue_pop: Queue is empty\n");
		errno = EINVAL;
		return NULL;
	}
	void* element = q->elements[q->start];
	q->start = (q->start + 1) % q->capacity;
	q->size = q->end - q->start;
	return element;
}

void clear_queue(Queue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	q->start = 0;
	q->end = 0;
	q->size = 0;
}

void free_queue(Queue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	free(q->elements);
	free(q);
}

void print_queue(const Queue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	printf("[");
	for (size_t i = 0; i < q->size; i++) {
		printf("%p", q->elements[(q->start + i) % q->capacity]);
		if (i < q->size - 1) {
			printf(", ");
		}
	}
	printf("]\n");
}

// int Queue

iQueue* new_iqueue(size_t initial_capacity) {
	
#ifdef QUEUE_MEM_CHECKS
	SAFE_NEW(iQueue, int);
#else
	RISKY_NEW(iQueue, int);
#endif
	
	q->size = 0;
	q->capacity = initial_capacity;
	q->start = 0;
	q->end = 0;
	return q;
}

void iqueue_push(iQueue* q, const int element) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	if (q->size == q->capacity)
		RESIZE_QUEUE(int);
	q->elements[q->end] = element;
	q->end = (q->end + 1) % q->capacity;
	q->size = q->end - q->start;
}

int iqueue_pop(iQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK(0);
#endif

	if (q->size == 0) {
		fprintf(stderr, "iqueue_pop: iQueue is empty\n");
		errno = EINVAL;
		return 0;
	}
	int element = q->elements[q->start];
	q->start = (q->start + 1) % q->capacity;
	q->size = q->end - q->start;
	return element;
}

void clear_iqueue(iQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	q->start = 0;
	q->end = 0;
	q->size = 0;
}

void free_iqueue(iQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	free(q->elements);
	free(q);
}

void print_iqueue(const iQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	printf("[");
	for (size_t i = 0; i < q->size; i++) {
		printf("%d", q->elements[(q->start + i) % q->capacity]);
		if (i < q->size - 1) {
			printf(", ");
		}
	}
	printf("]\n");
}

// double Queue

dQueue* new_dqueue(size_t initial_capacity) {
	
#ifdef QUEUE_MEM_CHECKS
	SAFE_NEW(dQueue, double);
#else
	RISKY_NEW(dQueue, double);
#endif
	
	q->size = 0;
	q->capacity = initial_capacity;
	q->start = 0;
	q->end = 0;
	return q;
}

void dqueue_push(dQueue* q, const double element) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	if (q->size == q->capacity)
		RESIZE_QUEUE(double);
	q->elements[q->end] = element;
	q->end = (q->end + 1) % q->capacity;
	q->size = q->end - q->start;
}

double dqueue_pop(dQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK(0.0);
#endif

	if (q->size == 0) {
		fprintf(stderr, "dqueue_pop: dQueue is empty\n");
		errno = EINVAL;
		return 0.0;
	}
	double element = q->elements[q->start];
	q->start = (q->start + 1) % q->capacity;
	q->size = q->end - q->start;
	return element;
}

void clear_dqueue(dQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	q->start = 0;
	q->end = 0;
	q->size = 0;
}

void free_dqueue(dQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	free(q->elements);
	free(q);
}

void print_dqueue(const dQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	printf("[");
	for (size_t i = 0; i < q->size; i++) {
		printf("%f", q->elements[(q->start + i) % q->capacity]);
		if (i < q->size - 1) {
			printf(", ");
		}
	}
	printf("]\n");
}

// char* Queue

sQueue* new_squeue(size_t initial_capacity) {
	
#ifdef QUEUE_MEM_CHECKS
	SAFE_NEW(sQueue, char*);
#else
	RISKY_NEW(sQueue, char*);
#endif
	
	q->size = 0;
	q->capacity = initial_capacity;
	q->start = 0;
	q->end = 0;
	return q;
}

void squeue_push(sQueue* q, const char* element) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	if (q->size == q->capacity)
		RESIZE_QUEUE(char*);
	q->elements[q->end] = strdup(element);
	if (!q->elements[q->end]) {
		fprintf(stderr, "squeue_push: strdup failed\n");
		return;
	}
	q->end = (q->end + 1) % q->capacity;
	q->size = q->end - q->start;
}

char* squeue_pop(sQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK(NULL);
#endif

	if (q->size == 0) {
		fprintf(stderr, "squeue_pop: sQueue is empty\n");
		errno = EINVAL;
		return NULL;
	}
	char* element = q->elements[q->start];
	q->start = (q->start + 1) % q->capacity;
	q->size = q->end - q->start;
	return element;
}

void clear_squeue(sQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	for (size_t i = 0; i < q->size; ++i) {
		free(q->elements[(q->start + i) % q->capacity]);
	}
	q->start = 0;
	q->end = 0;
	q->size = 0;
}

void free_squeue(sQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	for (size_t i = 0; i < q->size; ++i) {
		free(q->elements[(q->start + i) % q->capacity]);
	}
	free(q->elements);
	free(q);
}

void print_squeue(const sQueue* q) {

#ifdef QUEUE_NULL_CHECKS
	NULL_CHECK();
#endif

	printf("[");
	for (size_t i = 0; i < q->size; i++) {
		printf("\"%s\"", q->elements[(q->start + i) % q->capacity]);
		if (i < q->size - 1) {
			printf(", ");
		}
	}
	printf("]\n");
}
