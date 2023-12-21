#include "list.h"
#include "debug.h"

#include <stdlib.h>
#include <string.h>

// void* List

List* new_list(size_t initial_capacity) {
    List* list = malloc(sizeof(List));
    if (list == NULL) {
        report(stderr, "failed to allocate memory for list");
        return NULL;
    }
    list->elements = malloc(initial_capacity * sizeof(void*));
    if (list->elements == NULL) {
        // Error handling - failed to allocate memory
        report(stderr, "failed to allocate memory for list->elements");
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

void list_add(List* list, void* element) {
    if (list->size >= list->capacity) {
        list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
        list->elements = realloc(list->elements, list->capacity * sizeof(void*));
        if (list->elements == NULL) {
            report(stderr, "failed to reallocate memory for list->elements");
            return;
        }
    }
    list->elements[list->size++] = element;
}

void* list_pop(List* list, size_t index) {
    if (index >= list->size) {
        // Error handling - index out of bounds
        report(stderr, "index out of bounds (%zu)", index);
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

void free_list(List* list){
    free(list->elements);
    free(list);
}

void print_list(List* list, char* (*f)(void*)) {
    printf("[");
    for (size_t i = 0; i < list->size - 1; i++)
        printf("%s, ", f(list->elements[i]));
    if (list->size > 0)
        printf("%s", f(list->elements[list->size - 1]));
    printf("\n");
}

void fprintf_list(FILE* fp, List* list, char* (*f)(void*)) {
    fprintf(fp, "[");
    for (size_t i = 0; i < list->size - 1; i++)
        fprintf(fp, "%s, ", f(list->elements[i]));
    if (list->size > 0)
        fprintf(fp, "%s", f(list->elements[list->size - 1]));
    fprintf(fp, "]");
}

// int List

iList* new_ilist(size_t initial_capacity) {
    iList* list = malloc(sizeof(iList));
    if (list == NULL) {
        report(stderr, "failed to allocate memory for list");
        return NULL;
    }
    list->elements = malloc(initial_capacity * sizeof(int));
    if (list->elements == NULL) {
        report(stderr, "failed to allocate memory for list->elements");
        list->size = 0;
        list->capacity = 0;
        return list;
    }
    list->size = 0;
    list->capacity = initial_capacity;
    return list;
}

void ilist_add(iList* list, int element) {
    if (list->size >= list->capacity) {
        list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
        list->elements = realloc(list->elements, list->capacity * sizeof(int));
        if (list->elements == NULL) {
            report(stderr, "failed to reallocate memory for list->elements");
            return;
        }
    }
    list->elements[list->size++] = element;
}

int ilist_pop(iList* list, size_t index) {
    if (index >= list->size) {
        report(stderr, "index out of bounds (%zu).\n", index);
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

void free_ilist(iList* list) {
    free(list->elements);
    free(list);
}

void print_ilist(iList* list) {
    printf("[");
    for (size_t i = 0; i < list->size - 1; i++)
        printf("%i, ", list->elements[i]);
    if (list->size > 0)
        printf("%i", list->elements[list->size - 1]);
    printf("\n");
}

void fprintf_ilist(FILE* fp, iList* list) {
    fprintf(fp, "[");
    for (size_t i = 0; i < list->size - 1; i++)
        fprintf(fp, "%i, ", list->elements[i]);
    if (list->size > 0)
        fprintf(fp, "%i", list->elements[list->size - 1]);
    fprintf(fp, "]");
}

// double List

dList* new_dlist(size_t initial_capacity) {
    dList* list = malloc(sizeof(dList));
    if (list == NULL) {
        report(stderr, "failed to allocate memory for list");
        return NULL;
    }
    list->elements = malloc(initial_capacity * sizeof(double));
    if (list->elements == NULL) {
        report(stderr, "failed to allocate memory for list->elements");
        list->size = 0;
        list->capacity = 0;
        return list;
    }
    list->size = 0;
    list->capacity = initial_capacity;
    return list;
}

void dlist_add(dList* list, double element) {
    if (list->size >= list->capacity) {
        list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
        list->elements = realloc(list->elements, list->capacity * sizeof(double));
        if (list->elements == NULL) {
            report(stderr, "failed to reallocate memory for list->elements");
            return;
        }
    }
    list->elements[list->size++] = element;
}

double dlist_pop(dList* list, size_t index) {
    if (index >= list->size) {
        report(stderr, "index out of bounds (%zu).\n", index);
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

void free_dlist(dList* list) {
    free(list->elements);
    free(list);
}

void print_dlist(dList* list) {
    printf("[");
    for (size_t i = 0; i < list->size - 1; i++)
        printf("%f, ", list->elements[i]);
    if (list->size > 0)
        printf("%f", list->elements[list->size - 1]);
    printf("\n");
}

void fprintf_dlist(FILE* fp, dList* list) {
    fprintf(fp, "[");
    for (size_t i = 0; i < list->size - 1; i++)
        fprintf(fp, "%f, ", list->elements[i]);
    if (list->size > 0)
        fprintf(fp, "%f", list->elements[list->size - 1]);
    fprintf(fp, "]");
}

// char* List

sList* new_slist(size_t initial_capacity) {
    sList* list = malloc(sizeof(sList));
    if (list == NULL) {
        report(stderr, "failed to allocate memory for list");
        return NULL;
    }
    list->elements = malloc(initial_capacity * sizeof(char*));
    if (list->elements == NULL) {
        report(stderr, "failed to allocate memory for list->elements");
        list->size = 0;
        list->capacity = 0;
        return list;
    }
    list->size = 0;
    list->capacity = initial_capacity;
    return list;
}

void slist_add(sList* list, char* element) {
    if (list->size >= list->capacity) {
        list->capacity = (list->capacity == 0) ? 1 : 2 * list->capacity;
        list->elements = realloc(list->elements, list->capacity * sizeof(char*));
        if (list->elements == NULL) {
            report(stderr, "failed to reallocate memory for list->elements");
            return;
        }
    }
    int n = strlen(element);
    list->elements[list->size] = malloc((n + 1) * sizeof(char));
    memcpy(list->elements[list->size], element, n*sizeof(char));
    list->elements[list->size][n] = '\0';
    list->size++;
}

char* slist_pop(sList* list, size_t index) {
    if (index >= list->size) {
        report(stderr, "index out of bounds (%zu).\n", index);
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

void free_slist(sList* list){
    for (size_t i = 0; i < list->size; i++) free(list->elements[i]);
    free(list->elements);
    free(list);
}

void print_slist(sList* list, int quotes) {
    switch (quotes) {
        case 0:
            printf("[");
            for (size_t i = 0; i < list->size - 1; i++)
                printf("%s, ", list->elements[i]);
            if (list->size > 0)
                printf("%s", list->elements[list->size - 1]);
            printf("\n");
            break;
        case 1:
            printf("[");
            for (size_t i = 0; i < list->size - 1; i++)
                printf("'%s', ", list->elements[i]);
            if (list->size > 0)
                printf("'%s'", list->elements[list->size - 1]);
            printf("\n");
            break;
        case 2:
            printf("[");
            for (size_t i = 0; i < list->size - 1; i++)
                printf("\"%s\", ", list->elements[i]);
            if (list->size > 0)
                printf("\"%s\"", list->elements[list->size - 1]);
            printf("\n");
            break;
        default:
            report(stderr, "quotes can only be 0, 1 or 2");
            break;
    }
}

void fprintf_slist(FILE* fp, sList* list, int quotes) {
    switch (quotes) {
        case 0:
            fprintf(fp, "[");
            for (size_t i = 0; i < list->size - 1; i++)
                fprintf(fp, "%s, ", list->elements[i]);
            if (list->size > 0)
                fprintf(fp, "%s", list->elements[list->size - 1]);
            fprintf(fp, "]");
            break;
        case 1:
            fprintf(fp, "[");
            for (size_t i = 0; i < list->size - 1; i++)
                fprintf(fp, "'%s', ", list->elements[i]);
            if (list->size > 0)
                fprintf(fp, "'%s'", list->elements[list->size - 1]);
            fprintf(fp, "]");
            break;
        case 2:
            fprintf(fp, "[");
            for (size_t i = 0; i < list->size - 1; i++)
                fprintf(fp, "\"%s\", ", list->elements[i]);
            if (list->size > 0)
                fprintf(fp, "\"%s\"", list->elements[list->size - 1]);
            fprintf(fp, "]");
            break;
        default:
            report(stderr, "quotes can only be 0, 1 or 2");
            break;
    }
}
