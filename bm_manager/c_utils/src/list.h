#ifndef LIST_UTILS_H
#define LIST_UTILS_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
	void** elements;
	int size;
	int capacity;
} List;

typedef struct {
	int* elements;
	int size;
	int capacity;
} iList;

typedef struct {
	double* elements;
	int size;
	int capacity;
} dList;

typedef struct {
	char** elements;
	int size;
	int capacity;
} sList;

List* new_list(int initial_capacity);
iList* new_ilist(int initial_capacity);
dList* new_dlist(int initial_capacity);
sList* new_slist(int initial_capacity);

void list_add(List* list, void* element);
void ilist_add(iList* list, int element);
void dlist_add(dList* list, double element);
void slist_add(sList* list, char* element);

void* list_pop(List* list, int index);
int ilist_pop(iList* list, int index);
double dlist_pop(dList* list, int index);
char* slist_pop(sList* list, int index);

void set_list(List* list, void* value);
void set_ilist(iList* list, int value);
void set_dlist(dList* list, double value);
void set_slist(sList* list, char* value);

void clear_list(List* list);
void clear_ilist(iList* list);
void clear_dlist(dList* list);
void clear_slist(sList* list);

void free_list(List* list);
void free_ilist(iList* list);
void free_dlist(dList* list);
void free_slist(sList* list);

void print_list(List* list);
void fprintf_list(FILE* fp, List* list);
void print_ilist(iList* list);
void fprintf_ilist(FILE* fp, iList* list);
void print_dlist(dList* list);
void fprintf_dlist(FILE* fp, dList* list);
void print_slist(sList* list, int quotes);
void fprintf_slist(FILE* fp, sList* list, int quotes);

#endif