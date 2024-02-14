#include "list.h"
#include "debug.h"

#include <stdlib.h>
#include <string.h>

// void* List

List* new_list(size_t initial_capacity) {
	List* list = calloc(1, sizeof(List));
	if (list == NULL) {
		ereport("failed to allocate memory for list");
		return NULL;
	}
	list->elements = calloc(initial_capacity, sizeof(void*));
	if (list->elements == NULL) {
		// Error handling - failed to allocate memory
		ereport("failed to allocate memory for list->elements");
		list->size = 0;
		list->capacity = 0;
		return list;
	}
	for (size_t i = 0; i < initial_capacity; i++) {
		list->elements[i] = NULL;
	}
	list->size = 0;
	list->capacity = initial_capacity;
	return list;
}

void free_list(List* list){
	free(list->elements);
	free(list);
}

void list_add(List* list, void* element) {
	if (list->size >= list->capacity) {
		list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
		list->elements = realloc(list->elements, list->capacity * sizeof(void*));
		if (list->elements == NULL) {
			ereport("failed to reallocate memory for list->elements");
			return;
		}
	}
	list->elements[list->size++] = element;
}

void* list_pop(List* list, size_t index) {
	if (index >= list->size) {
		ereport("index out of bounds (%zu)", index);
		return NULL;
	}
	void* element = list->elements[index];
	for (size_t i = index; i < list->size - 1; i++) {
		list->elements[i] = list->elements[i + 1];
	}
	list->size--;
	return element;
}

void set_list(List* list, void* value) {
	list->size = list->capacity;
	for (size_t i = 0; i < list->size; i++) list->elements[i] = (void*)value;
}

void clear_list(List* list) {
	set_list(list, NULL);
	list->size = 0;
}

List* duplicate_list(List* list) {
	List* dup = new_list(list->capacity);
	memcpy(dup->elements, list->elements, list->size * sizeof(void*));
	dup->size = list->size;
	return dup;
}

int list_contains(List* list, void* element, int (*compare_function)(const void*, const void*)) {
	for (size_t i = 0; i < list->size; i++)
		if (compare_function(list->elements[i], element) != 0)
			return 1;
	return 0;
}

void fprintf_list(List *list, FILE *fp, char* (*repr_function)(void*)) {
	fprintf(fp, "[");
	if (list->size == 0) {
		fprintf(fp, "]");
		return;
	}
	for (size_t i = 0; i < list->size - 1; i++)
		fprintf(fp, "%s, ", repr_function(list->elements[i]));
	fprintf(fp, "%s", repr_function(list->elements[list->size - 1]));
	fprintf(fp, "]");
}

void print_list(List *list, char* (*repr_function)(void*)) {
	fprintf_list(list, stdout, repr_function);
}

void pprint_list(List *list, char* (*repr_function)(void*)) {
	printf("list = ");
	fprintf_list(list, stdout, repr_function);
	printf("\n");
}

// int List

iList* new_ilist(size_t initial_capacity) {
	iList* list = calloc(1, sizeof(iList));
	if (list == NULL) {
		ereport("failed to allocate memory for list");
		return NULL;
	}
	list->elements = calloc(initial_capacity, sizeof(int));
	if (list->elements == NULL) {
		ereport("failed to allocate memory for list->elements");
		list->size = 0;
		list->capacity = 0;
		return list;
	}
	list->size = 0;
	list->capacity = initial_capacity;
	return list;
}

void free_ilist(iList* list) {
	free(list->elements);
	free(list);
}

void ilist_add(iList* list, int element) {
	if (list->size >= list->capacity) {
		list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
		list->elements = realloc(list->elements, list->capacity * sizeof(int));
		if (list->elements == NULL) {
			ereport("failed to reallocate memory for list->elements");
			return;
		}
	}
	list->elements[list->size++] = element;
}

int ilist_pop(iList* list, size_t index) {
	if (index >= list->size) {
		ereport("index out of bounds (%zu)", index);
		return -1;
	}
	int element = list->elements[index];
	for (size_t i = index; i < list->size - 1; i++) {
		list->elements[i] = list->elements[i + 1];
	}
	list->size--;
	return element;
}

void set_ilist(iList* list, int value) {
	list->size = list->capacity;
	for (size_t i = 0; i < list->size; i++) list->elements[i] = value;
}

void clear_ilist(iList* list) {
	set_ilist(list, 0);
	list->size = 0;
}

iList* duplicate_ilist(iList* list) {
	iList* dup = new_ilist(list->capacity);
	memcpy(dup->elements, list->elements, list->size * sizeof(void*));
	dup->size = list->size;
	return dup;
}

int ilist_contains(iList* list, int element) {
	for (size_t i = 0; i < list->size; i++)
		if (list->elements[i] == element)
			return 1;
	return 0;
}

void fprintf_ilist(iList *list, FILE *fp) {
	fprintf(fp, "[");
	if (list->size == 0) {
		fprintf(fp, "]");
		return;
	}
	for (size_t i = 0; i < list->size - 1; i++)
		fprintf(fp, "%i, ", list->elements[i]);
	fprintf(fp, "%i", list->elements[list->size - 1]);
	fprintf(fp, "]");
}

void print_ilist(iList *list) {
	fprintf_ilist(list, stdout);
}

void pprint_ilist(iList *list) {
	printf("ilist = ");
	fprintf_ilist(list, stdout);
	printf("\n");
}

// double List

dList* new_dlist(size_t initial_capacity) {
	dList* list = calloc(1, sizeof(dList));
	if (list == NULL) {
		ereport("failed to allocate memory for list");
		return NULL;
	}
	list->elements = calloc(initial_capacity, sizeof(double));
	if (list->elements == NULL) {
		ereport("failed to allocate memory for list->elements");
		list->size = 0;
		list->capacity = 0;
		return list;
	}
	list->size = 0;
	list->capacity = initial_capacity;
	return list;
}

void free_dlist(dList* list) {
	free(list->elements);
	free(list);
}

void dlist_add(dList* list, double element) {
	if (list->size >= list->capacity) {
		list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
		list->elements = realloc(list->elements, list->capacity * sizeof(double));
		if (list->elements == NULL) {
			ereport("failed to reallocate memory for list->elements");
			return;
		}
	}
	list->elements[list->size++] = element;
}

double dlist_pop(dList* list, size_t index) {
	if (index >= list->size) {
		ereport("index out of bounds (%zu)", index);
		return -1;
	}
	double element = list->elements[index];
	for (size_t i = index; i < list->size - 1; i++) {
		list->elements[i] = list->elements[i + 1];
	}
	list->size--;
	return element;
}

void set_dlist(dList* list, double value) {
	list->size = list->capacity;
	for (size_t i = 0; i < list->size; i++) list->elements[i] = value;
}

void clear_dlist(dList* list) {
	set_dlist(list, 0.0);
	list->size = 0;
}

dList* duplicate_dlist(dList* list) {
	dList* dup = new_dlist(list->capacity);
	memcpy(dup->elements, list->elements, list->size * sizeof(void*));
	dup->size = list->size;
	return dup;
}

int dlist_contains(dList* list, double element) {
	for (size_t i = 0; i < list->size; i++)
		if (list->elements[i] == element)
			return 1;
	return 0;
}

void fprintf_dlist(dList *list, FILE *fp) {
	fprintf(fp, "[");
	if (list->size == 0) {
		fprintf(fp, "]");
		return;
	}
	for (size_t i = 0; i < list->size - 1; i++)
		fprintf(fp, "%f, ", list->elements[i]);
	fprintf(fp, "%f", list->elements[list->size - 1]);
	fprintf(fp, "]");
}

void print_dlist(dList *list) {
	fprintf_dlist(list, stdout);
}

void pprint_dlist(dList *list) {
	printf("dlist = ");
	fprintf_dlist(list, stdout);
	printf("\n");
}

// char* List

sList* new_slist(size_t initial_capacity) {
	sList* list = calloc(1, sizeof(sList));
	if (list == NULL) {
		ereport("failed to allocate memory for list");
		return NULL;
	}
	list->elements = calloc(initial_capacity, sizeof(char*));
	if (list->elements == NULL) {
		ereport("failed to allocate memory for list->elements");
		list->size = 0;
		list->capacity = 0;
		return list;
	}
	list->size = 0;
	list->capacity = initial_capacity;
	return list;
}

void free_slist(sList* list){
	for (size_t i = 0; i < list->size; i++) free(list->elements[i]);
	free(list->elements);
	free(list);
}

void slist_add(sList* list, char* element) {
	if (list->size >= list->capacity) {
		list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
		list->elements = realloc(list->elements, list->capacity * sizeof(char*));
		if (list->elements == NULL) {
			ereport("failed to reallocate memory for list->elements");
			return;
		}
	}
	int n = strlen(element);
	list->elements[list->size] = calloc(n + 1, sizeof(char));
	memcpy(list->elements[list->size], element, n*sizeof(char));
	list->elements[list->size][n] = '\0';
	list->size++;
}

char* slist_pop(sList* list, size_t index) {
	if (index >= list->size) {
		ereport("index out of bounds (%zu)", index);
		return NULL;
	}
	char* element = list->elements[index];
	for (size_t i = index; i < list->size - 1; i++) {
		list->elements[i] = list->elements[i + 1];
	}
	list->size--;
	return element;
}

void set_slist(sList* list, char* value) {
	list->size = list->capacity;
	size_t n = strlen(value);
	for (size_t i = 0; i < list->size; i++) {
		list->elements[i] = realloc(list->elements[i], (n+1)*sizeof(char));
		memcpy(list->elements[i], value, n * sizeof(char));
		list->elements[i][n] = '\0';
	}
}

void clear_slist(sList* list) {
	set_slist(list, "");
	list->size = 0;
}

sList* duplicate_slist(sList* list) {
	sList* dup = new_slist(list->capacity);
	memcpy(dup->elements, list->elements, list->size * sizeof(void*));
	dup->size = list->size;
	return dup;
}

int slist_contains(sList* list, char* element) {
	for (size_t i = 0; i < list->size; i++)
		if (strcmp(list->elements[i], element) == 0)
			return 1;
	return 0;
}

void fprintf_slist_quotes(sList *list, FILE *fp, char quote) {
	fprintf(fp, "[");
	if (list->size == 0) {
		fprintf(fp, "]");
		return;
	}
	for (size_t i = 0; i < list->size - 1; i++) {
		if (list->elements[i])
			fprintf(fp, "%c%s%c, ", quote, list->elements[i], quote);
		else
			fprintf(fp, "NULL, ");
	}
	if (list->elements[list->size - 1])
		fprintf(fp, "%c%s%c", quote, list->elements[list->size - 1], quote);
	else
		fprintf(fp, "NULL");
	fprintf(fp, "]");
}

void fprintf_slist(sList *list, FILE *fp, int quote) {
	if (quote == 0) {
		fprintf_slist_quotes(list, fp, '\0');
		return;
	}
	fprintf_slist_quotes(list, fp, (quote % 2 == 0) ? '"' * (quote / 2) : '\'' * quote);
}

void print_slist(sList *list, int quote) {
	fprintf_slist(list, stdout, quote);
}

void pprint_slist(sList *list, int quote) {
	printf("slist = ");
	fprintf_slist(list, stdout, quote);
	printf("\n");
}