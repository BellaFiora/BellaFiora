#ifndef QUEUE_UTILS_H
#define QUEUE_UTILS_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
	void** elements;
	int size;
	int capacity;
} Queue;

typedef struct {
	int* elements;
	int size;
	int capacity;
} iQueue;

typedef struct {
	double* elements;
	int size;
	int capacity;
} dQueue;

typedef struct {
	char** elements;
	int size;
	int capacity;
} sQueue;

Queue* new_queue(int initial_capacity);
iQueue* new_iqueue(int initial_capacity);
dQueue* new_dqueue(int initial_capacity);
sQueue* new_squeue(int initial_capacity);

void queue_push(Queue* queue, void* element);
void iqueue_push(iQueue* queue, int element);
void dqueue_push(dQueue* queue, double element);
void squeue_push(sQueue* queue, char* element);

void* queue_pop(Queue* queue);
int iqueue_pop(iQueue* queue);
double dqueue_pop(dQueue* queue);
char* squeue_pop(sQueue* queue);

void clear_queue(Queue* queue);
void clear_iqueue(iQueue* queue);
void clear_dqueue(dQueue* queue);
void clear_squeue(sQueue* queue);

void free_queue(Queue* queue);
void free_iqueue(iQueue* queue);
void free_dqueue(dQueue* queue);
void free_squeue(sQueue* queue);

void print_queue(Queue* queue);
void print_iqueue(iQueue* queue);
void print_dqueue(dQueue* queue);
void print_squeue(sQueue* queue);

#endif