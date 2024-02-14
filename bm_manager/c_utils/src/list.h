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
void free_list(List* list);
void list_add(List* list, void* element);
void set_list(List* list, void* value);
void* list_pop(List* list, size_t index);
void clear_list(List* list);
List* duplicate_list(List* list);
int list_contains(List* list, void* element, int (*compare_function)(const void*, const void*));
void fprintf_list(List *list, FILE *fp, char* (*repr_function)(void*));
void print_list(List *list, char* (*repr_function)(void*));
void pprint_list(List *list, char* (*repr_function)(void*));

// int List

typedef struct {
	int* elements;
	size_t size;
	size_t capacity;
} iList;

iList* new_ilist(size_t initial_capacity);
void free_ilist(iList* list);
void ilist_add(iList* list, int element);
int ilist_pop(iList* list, size_t index);
void set_ilist(iList* list, int value);
void clear_ilist(iList* list);
iList* duplicate_ilist(iList* list);
int ilist_contains(iList* list, int element);
void fprintf_ilist(iList *list, FILE *fp);
void print_ilist(iList *list);
void pprint_ilist(iList *list);

// double List

typedef struct {
	double* elements;
	size_t size;
	size_t capacity;
} dList;

dList* new_dlist(size_t initial_capacity);
void free_dlist(dList* list);
void dlist_add(dList* list, double element);
double dlist_pop(dList* list, size_t index);
void set_dlist(dList* list, double value);
void clear_dlist(dList* list);
dList* duplicate_dlist(dList* list);
int dlist_contains(dList* list, double element);
void fprintf_dlist(dList *list, FILE *fp);
void print_dlist(dList *list);
void pprint_dlist(dList *list);

// char* List

typedef struct {
	char** elements;
	size_t size;
	size_t capacity;
} sList;

sList* new_slist(size_t initial_capacity);
void free_slist(sList* list);
void slist_add(sList* list, char* element);
char* slist_pop(sList* list, size_t index);
void set_slist(sList* list, char* value);
void clear_slist(sList* list);
sList* duplicate_slist(sList* list);
int slist_contains(sList* list, char* element);
void fprintf_slist(sList *list, FILE *fp, int quote);
void print_slist(sList *list, int quote);
void pprint_slist(sList *list, int quote);

#endif
