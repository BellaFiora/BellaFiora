#include "list.h"

List* new_list(int initial_capacity) {
	List* list = malloc(sizeof(List));
	if (list == NULL) {
		printf("new_list: Failed to allocate memory for list.\n");
		return NULL;
	}
	list->elements = malloc(initial_capacity * sizeof(void*));
	if (list->elements == NULL) {
		// Error handling - failed to allocate memory
		printf("new_list: Failed to allocate memory for list->elements.\n");
		list->size = 0;
		list->capacity = 0;
		return list;
	}
	for (int i = 0; i < initial_capacity; i++) {
		list->elements[i] = NULL;
	}
	list->size = 0;
	list->capacity = initial_capacity;
	return list;
}

iList* new_ilist(int initial_capacity) {
	iList* list = malloc(sizeof(iList));
	if (list == NULL) {
		printf("new_ilist: Failed to allocate memory for list.\n");
		return NULL;
	}
	list->elements = malloc(initial_capacity * sizeof(int));
	if (list->elements == NULL) {
		printf("new_ilist: Failed to allocate memory for list->elements.\n");
		list->size = 0;
		list->capacity = 0;
		return list;
	}
	list->size = 0;
	list->capacity = initial_capacity;
	return list;
}

dList* new_dlist(int initial_capacity) {
	dList* list = malloc(sizeof(dList));
	if (list == NULL) {
		printf("new_dlist: Failed to allocate memory for list.\n");
		return NULL;
	}
	list->elements = malloc(initial_capacity * sizeof(double));
	if (list->elements == NULL) {
		printf("new_dlist: Failed to allocate memory for list->elements.\n");
		list->size = 0;
		list->capacity = 0;
		return list;
	}
	list->size = 0;
	list->capacity = initial_capacity;
	return list;
}

sList* new_slist(int initial_capacity) {
	sList* list = malloc(sizeof(sList));
	if (list == NULL) {
		printf("new_slist: Failed to allocate memory for list.\n");
		return NULL;
	}
	list->elements = malloc(initial_capacity * sizeof(char*));
	if (list->elements == NULL) {
		printf("new_slist: Failed to allocate memory for list->elements.\n");
		list->size = 0;
		list->capacity = 0;
		return list;
	}
	list->size = 0;
	list->capacity = initial_capacity;
	return list;
}


void list_add(List* list, void* element) {
	if (list->size >= list->capacity) {
		list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
		list->elements = realloc(list->elements, list->capacity * sizeof(void*));
		if (list->elements == NULL) {
			printf("list_add: Failed to reallocate memory for list->elements.\n");
			return;
		}
	}
	list->elements[list->size++] = element;
}

void ilist_add(iList* list, int element) {
	if (list->size >= list->capacity) {
		list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
		list->elements = realloc(list->elements, list->capacity * sizeof(int));
		if (list->elements == NULL) {
			printf("ilist_add: Failed to reallocate memory for list->elements.\n");
			return;
		}
	}
	list->elements[list->size++] = element;
}
void dlist_add(dList* list, double element) {
	if (list->size >= list->capacity) {
		list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
		list->elements = realloc(list->elements, list->capacity * sizeof(double));
		if (list->elements == NULL) {
			printf("dlist_add: Failed to reallocate memory for list->elements.\n");
			return;
		}
	}
	list->elements[list->size++] = element;
}

void slist_add(sList* list, char* element) {
	if (list->size >= list->capacity) {
		list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
		list->elements = realloc(list->elements, list->capacity * sizeof(char*));
		if (list->elements == NULL) {
			printf("slist_add: Failed to reallocate memory for list->elements.\n");
			return;
		}
	}
	int n = strlen(element);
	list->elements[list->size] = malloc((n + 1) * sizeof(char));
	memcpy(list->elements[list->size], element, n*sizeof(char));
	list->elements[list->size][n] = '\0';
	list->size++;
}


void* list_pop(List* list, int index) {
	if (index < 0 || index >= list->size) {
		// Error handling - index out of bounds
		printf("list_pop: Index out of bounds (%i).\n", index);
		return NULL;
	}
	void* element = list->elements[index];
	for (int i = index; i < list->size - 1; i++) {
		list->elements[i] = list->elements[i + 1];
	}
	list->size--;
	return element;
}

int ilist_pop(iList* list, int index) {
	if (index < 0 || index >= list->size) {
		printf("ilist_pop: Index out of bounds (%i).\n", index);
		return -1;
	}
	int element = list->elements[index];
	for (int i = index; i < list->size - 1; i++) {
		list->elements[i] = list->elements[i + 1];
	}
	list->size--;
	return element;
}

double dlist_pop(dList* list, int index) {
	if (index < 0 || index >= list->size) {
		printf("dlist_pop: Index out of bounds (%i).\n", index);
		return -1;
	}
	double element = list->elements[index];
	for (int i = index; i < list->size - 1; i++) {
		list->elements[i] = list->elements[i + 1];
	}
	list->size--;
	return element;
}

char* slist_pop(sList* list, int index) {
	if (index < 0 || index >= list->size) {
		printf("slist_pop: Index out of bounds (%i).\n", index);
		return NULL;
	}
	char* element = list->elements[index];
	for (int i = index; i < list->size - 1; i++) {
		list->elements[i] = list->elements[i + 1];
	}
	list->size--;
	return element;
}


void set_list(List* list, void* value) {
	list->size = list->capacity;
	for (int i = 0; i < list->size; i++) list->elements[i] = (void*)value;
}

void set_ilist(iList* list, int value) {
	list->size = list->capacity;
	for (int i = 0; i < list->size; i++) list->elements[i] = value;
}

void set_dlist(dList* list, double value) {
	list->size = list->capacity;
	for (int i = 0; i < list->size; i++) list->elements[i] = value;
}

void set_slist(sList* list, char* value) {
	list->size = list->capacity;
	size_t n = strlen(value);
	for (int i = 0; i < list->size; i++) {
		list->elements[i] = realloc(list->elements[i], (n+1)*sizeof(char));
		memcpy(list->elements[i], value, n * sizeof(char));
		list->elements[i][n] = '\0';
	}
}


void clear_list(List* list) {
	set_list(list, NULL);
	list->size = 0;
}

void clear_ilist(iList* list) {
	set_ilist(list, 0);
	list->size = 0;
}

void clear_dlist(dList* list) {
	set_dlist(list, 0.0);
	list->size = 0;
}

void clear_slist(sList* list) {
	set_slist(list, "");
	list->size = 0;
}


void free_list(List* list){
	free(list->elements);
	free(list);
}

void free_ilist(iList* list) {
	free(list->elements);
	free(list);
}

void free_dlist(dList* list) {
	free(list->elements);
	free(list);
}

void free_slist(sList* list){
	for (int i = 0; i < list->size; i++) free(list->elements[i]);
	free(list->elements);
	free(list);
}


void print_list(List* list) {
	printf("[");
	for (int i = 0; i < list->size - 1; i++)
		printf("%p, ", list->elements[i]);
	if (list->size > 0)
		printf("%p", list->elements[list->size - 1]);
	printf("]\n");
}

void fprintf_list(FILE* fp, List* list) {
	fprintf(fp, "[");
	for (int i = 0; i < list->size - 1; i++)
		fprintf(fp, "%p, ", list->elements[i]);
	if (list->size > 0)
		fprintf(fp, "%p", list->elements[list->size - 1]);
	fprintf(fp, "]");
}

void print_ilist(iList* list) {
	printf("[");
	for (int i = 0; i < list->size - 1; i++)
		printf("%i, ", list->elements[i]);
	if (list->size > 0)
		printf("%i", list->elements[list->size - 1]);
	printf("]\n");
}

void fprintf_ilist(FILE* fp, iList* list) {
	fprintf(fp, "[");
	for (int i = 0; i < list->size - 1; i++)
		fprintf(fp, "%i, ", list->elements[i]);
	if (list->size > 0)
		fprintf(fp, "%i", list->elements[list->size - 1]);
	fprintf(fp, "]");
}

void print_dlist(dList* list) {
	printf("[");
	for (int i = 0; i < list->size - 1; i++)
		printf("%f, ", list->elements[i]);
	if (list->size > 0)
		printf("%f", list->elements[list->size - 1]);
	printf("]\n");
}

void fprintf_dlist(FILE* fp, dList* list) {
	fprintf(fp, "[");
	for (int i = 0; i < list->size - 1; i++)
		fprintf(fp, "%f, ", list->elements[i]);
	if (list->size > 0)
		fprintf(fp, "%f", list->elements[list->size - 1]);
	fprintf(fp, "]");
}

void print_slist(sList* list, int quotes) {
	if (quotes == 0){
		printf("[");
		for (int i = 0; i < list->size - 1; i++)
			printf("%s, ", list->elements[i]);
		if (list->size > 0)
			printf("%s", list->elements[list->size - 1]);
		printf("]\n");
	}
	else if (quotes == 1){
		printf("[");
		for (int i = 0; i < list->size - 1; i++)
			printf("'%s', ", list->elements[i]);
		if (list->size > 0)
			printf("'%s'", list->elements[list->size - 1]);
		printf("]\n");
	}
	else{
		printf("[");
		for (int i = 0; i < list->size - 1; i++)
			printf("\"%s\", ", list->elements[i]);
		if (list->size > 0)
			printf("\"%s\"", list->elements[list->size - 1]);
		printf("]\n");
	}
}

void fprintf_slist(FILE* fp, sList* list, int quotes) {
	if (quotes == 0){
		fprintf(fp, "[");
		for (int i = 0; i < list->size - 1; i++)
			fprintf(fp, "%s, ", list->elements[i]);
		if (list->size > 0)
			fprintf(fp, "%s", list->elements[list->size - 1]);
		fprintf(fp, "]");
	}
	else if (quotes == 1){
		fprintf(fp, "[");
		for (int i = 0; i < list->size - 1; i++)
			fprintf(fp, "'%s', ", list->elements[i]);
		if (list->size > 0)
			fprintf(fp, "'%s'", list->elements[list->size - 1]);
		fprintf(fp, "]");
	}
	else{
		fprintf(fp, "[");
		for (int i = 0; i < list->size - 1; i++)
			fprintf(fp, "\"%s\", ", list->elements[i]);
		if (list->size > 0)
			fprintf(fp, "\"%s\"", list->elements[list->size - 1]);
		fprintf(fp, "]");
	}
}