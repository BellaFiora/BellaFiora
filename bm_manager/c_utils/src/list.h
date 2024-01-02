#ifndef LIST_UTILS_H
#define LIST_UTILS_H

#include <stdio.h>

// void* List

typedef struct {
    void** elements;
    size_t size;
    size_t capacity;
} List;

List* new_list(size_t initial_capacity);
void list_add(List* list, void* element);
void set_list(List* list, void* value);
void* list_pop(List* list, size_t index);
void clear_list(List* list);
void free_list(List* list);
void print_list(List* list, char* (*f)(void*));
void fprintf_list(FILE* fp, List* list, char* (*f)(void*));

// int List

typedef struct {
    int* elements;
    size_t size;
    size_t capacity;
} iList;

iList* new_ilist(size_t initial_capacity);
void ilist_add(iList* list, int element);
int ilist_pop(iList* list, size_t index);
void set_ilist(iList* list, int value);
void clear_ilist(iList* list);
void free_ilist(iList* list);
void print_ilist(iList* list);
void fprintf_ilist(FILE* fp, iList* list);

// double List

typedef struct {
    double* elements;
    size_t size;
    size_t capacity;
} dList;

dList* new_dlist(size_t initial_capacity);
void dlist_add(dList* list, double element);
double dlist_pop(dList* list, size_t index);
void set_dlist(dList* list, double value);
void clear_dlist(dList* list);
void free_dlist(dList* list);
void print_dlist(dList* list);
void fprintf_dlist(FILE* fp, dList* list);

// char* List

typedef struct {
    char** elements;
    size_t size;
    size_t capacity;
} sList;

sList* new_slist(size_t initial_capacity);
void slist_add(sList* list, char* element);
char* slist_pop(sList* list, size_t index);
void set_slist(sList* list, char* value);
void clear_slist(sList* list);
void free_slist(sList* list);
void print_slist(sList* list, int quotes);
void fprintf_slist(FILE* fp, sList* list, int quotes);

#endif
