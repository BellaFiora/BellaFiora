#include "queue.h"

Queue* new_queue(int initial_capacity) {
	Queue* queue = (Queue*)malloc(sizeof(Queue));
	queue->elements = (void**)malloc(initial_capacity * sizeof(void*));
	queue->size = 0;
	queue->capacity = initial_capacity;
	return queue;
}

iQueue* new_iqueue(int initial_capacity) {
	iQueue* queue = (iQueue*)malloc(sizeof(iQueue));
	queue->elements = (int*)malloc(initial_capacity * sizeof(int));
	queue->size = 0;
	queue->capacity = initial_capacity;
	return queue;
}

dQueue* new_dqueue(int initial_capacity) {
	dQueue* queue = (dQueue*)malloc(sizeof(dQueue));
	queue->elements = (double*)malloc(initial_capacity * sizeof(double));
	queue->size = 0;
	queue->capacity = initial_capacity;
	return queue;
}

sQueue* new_squeue(int initial_capacity) {
	sQueue* queue = (sQueue*)malloc(sizeof(sQueue));
	queue->elements = (char**)malloc(initial_capacity * sizeof(char*));
	queue->size = 0;
	queue->capacity = initial_capacity;
	return queue;
}


void queue_push(Queue* queue, void* element) {
	if (queue->size == queue->capacity) {
		queue->capacity *= 2;  // Double the capacity if the queue is full
		queue->elements = (void**)realloc(queue->elements, queue->capacity * sizeof(void*));
	}
	queue->elements[queue->size++] = element;
}

void iqueue_push(iQueue* queue, int element) {
	if (queue->size == queue->capacity) {
		queue->capacity *= 2;
		queue->elements = (int*)realloc(queue->elements, queue->capacity * sizeof(int));
	}
	queue->elements[queue->size++] = element;
}

void dqueue_push(dQueue* queue, double element) {
	if (queue->size == queue->capacity) {
		queue->capacity *= 2;
		queue->elements = (double*)realloc(queue->elements, queue->capacity * sizeof(double));
	}
	queue->elements[queue->size++] = element;
}

void squeue_push(sQueue* queue, char* element) {
	if (queue->size == queue->capacity) {
		queue->capacity *= 2;
		queue->elements = (char**)realloc(queue->elements, queue->capacity * sizeof(char*));
	}
	queue->elements[queue->size] = (char*)malloc((strlen(element) + 1) * sizeof(char));
	strcpy(queue->elements[queue->size++], element);
}


void* queue_pop(Queue* queue) {
	if (queue->size == 0) {
		printf("Error: Queue is empty.\n");
		return NULL;
	}
	void* element = queue->elements[0];
	for (int i = 0; i < queue->size - 1; i++) {
		queue->elements[i] = queue->elements[i + 1];
	}
	queue->size--;
	return element;
}

int iqueue_pop(iQueue* queue) {
	if (queue->size == 0) {
		printf("Error: Queue is empty.\n");
		return 0;
	}
	int element = queue->elements[0];
	for (int i = 0; i < queue->size - 1; i++) queue->elements[i] = queue->elements[i + 1];
	queue->size--;
	return element;
}

double dqueue_pop(dQueue* queue) {
	if (queue->size == 0) {
		printf("Error: Queue is empty.\n");
		return 0.0;
	}
	double element = queue->elements[0];
	for (int i = 0; i < queue->size - 1; i++) queue->elements[i] = queue->elements[i + 1];
	queue->size--;
	return element;
}

char* squeue_pop(sQueue* queue) {
	if (queue->size == 0) {
		printf("Error: Queue is empty.\n");
		return NULL;
	}
	char* element = queue->elements[0];
	for (int i = 0; i < queue->size - 1; i++) queue->elements[i] = queue->elements[i + 1];
	queue->size--;
	return element;
}


void clear_queue(Queue* queue) {
	queue->size = 0;
}

void clear_iqueue(iQueue* queue) {
	queue->size = 0;
}

void clear_dqueue(dQueue* queue) {
	queue->size = 0;
}

void clear_squeue(sQueue* queue) {
	queue->size = 0;
}


void free_queue(Queue* queue) {
	free(queue->elements);
	free(queue);
}

void free_iqueue(iQueue* queue) {
	free(queue->elements);
	free(queue);
}

void free_dqueue(dQueue* queue) {
	free(queue->elements);
	free(queue);
}

void free_squeue(sQueue* queue) {
	for (int i = 0; i < queue->size; i++) free(queue->elements[i]);
	free(queue->elements);
	free(queue);
}


void print_queue(Queue* queue) {
	printf("[");
	for (int i = 0; i < queue->size - 1; i++)
		printf("%p, ", queue->elements[i]);
	if (queue->size > 0)
		printf("%p", queue->elements[queue->size - 1]);
	printf("]\n");
}

void print_iqueue(iQueue* queue) {
	printf("[");
	for (int i = 0; i < queue->size - 1; i++)
		printf("%i, ", queue->elements[i]);
	if (queue->size > 0)
		printf("%i", queue->elements[queue->size - 1]);
	printf("]\n");
}

void print_dqueue(dQueue* queue) {
	printf("[");
	for (int i = 0; i < queue->size - 1; i++)
		printf("%f, ", queue->elements[i]);
	if (queue->size > 0)
		printf("%f", queue->elements[queue->size - 1]);
	printf("]\n");
}

void print_squeue(sQueue* queue) {
	printf("[");
	for (int i = 0; i < queue->size - 1; i++)
		printf("%s, ", queue->elements[i]);
	if (queue->size > 0)
		printf("%s", queue->elements[queue->size - 1]);
	printf("]\n");
}