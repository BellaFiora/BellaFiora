#ifndef QUEUE_UTILS_H
#define QUEUE_UTILS_H

#include <stdlib.h>

// #define QUEUE_NULL_CHECKS
#define QUEUE_MEM_CHECKS
// void* Queue

typedef struct {
    void** elements;
    size_t size;
    size_t capacity;
    size_t start;
    size_t end;
} Queue;

Queue* new_queue(size_t initial_capacity);
void queue_push(Queue* q, const void* element);
void* queue_pop(Queue* q);
void clear_queue(Queue* q);
void free_queue(Queue* q);
void print_queue(const Queue* q);

// int Queue

typedef struct {
    int* elements;
    size_t size;
    size_t capacity;
    size_t start;
    size_t end;
} iQueue;

iQueue* new_iqueue(size_t initial_capacity);
void iqueue_push(iQueue* q, const int element);
int iqueue_pop(iQueue* q);
void clear_iqueue(iQueue* q);
void free_iqueue(iQueue* q);
void print_iqueue(const iQueue* q);

// double Queue

typedef struct {
    double* elements;
    size_t size;
    size_t capacity;
    size_t start;
    size_t end;
} dQueue;

dQueue* new_dqueue(size_t initial_capacity);
void dqueue_push(dQueue* q, const double element);
double dqueue_pop(dQueue* q);
void clear_dqueue(dQueue* q);
void free_dqueue(dQueue* q);
void print_dqueue(const dQueue* q);

// char* Queue

typedef struct {
    char** elements;
    size_t size;
    size_t capacity;
    size_t start;
    size_t end;
} sQueue;

sQueue* new_squeue(size_t initial_capacity);
void squeue_push(sQueue* q, const char* element);
char* squeue_pop(sQueue* q);
void clear_squeue(sQueue* q);
void free_squeue(sQueue* q);
void print_squeue(const sQueue* q);

#endif
