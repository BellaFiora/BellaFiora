#define EXCLUDE
#ifndef EXCLUDE

#include "debug.h"

#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <assert.h>
#include <stdarg.h>
#include <math.h>

/* DBGI */

void DBGI_int(const char* name, int n) {
    printf(DBG_PREFIX"%i\n", name, n);
}

void DBGI_long(const char* name, long n) {
    printf(DBG_PREFIX"%ld\n", name, n);
}

void DBGI_long_long(const char* name, long long n) {
    printf(DBG_PREFIX"%lld\n", name, n);
}

void DBGI_unsigned_char(const char* name, unsigned char n) {
    printf(DBG_PREFIX"%u\n", name, n);
}

void DBGI_char(const char* name, char n) {
    printf(DBG_PREFIX"%i\n", name, n);
}

void DBGI_size_t(const char* name, size_t n) {
    printf(DBG_PREFIX"%zu\n", name, n);
}

/* DBGBIN */

static char bits[sizeof(size_t) * 8] = { 0 };

void DBGBIN_char(const char* name, char n) {
    int nb_bits = sizeof(char) * 8;
    printf(DBG_PREFIX"", name);
    for (int i = 0; i < nb_bits; i++){
        bits[i] = n % 2 + '0';
        n /= 2;
    }
    for (int i = nb_bits - 1; i >= 0; i--)
        putchar(bits[i]);
    putchar('\n');
}

void DBGBIN_unsigned_char(const char* name, unsigned char n) {
    int nb_bits = sizeof(unsigned char) * 8;
    printf(DBG_PREFIX"", name);
    for (int i = 0; i < nb_bits; i++){
        bits[i] = n % 2 + '0';
        n /= 2;
    }
    for (int i = nb_bits - 1; i >= 0; i--)
        putchar(bits[i]);
    putchar('\n');
}

void DBGBIN_int(const char* name, int n) {
    int nb_bits = sizeof(int) * 8;
    printf(DBG_PREFIX"", name);
    for (int i = 0; i < nb_bits; i++){
        bits[i] = n % 2 + '0';
        n /= 2;
    }
    for (int i = nb_bits - 1; i >= 0; i--)
        putchar(bits[i]);
    putchar('\n');
}

void DBGBIN_size_t(const char* name, size_t n) {
    int nb_bits = sizeof(size_t) * 8;
    printf(DBG_PREFIX"", name);
    for (int i = 0; i < nb_bits; i++){
        bits[i] = n % 2 + '0';
        n /= 2;
    }
    for (int i = nb_bits - 1; i >= 0; i--)
        putchar(bits[i]);
    putchar('\n');
}

/* DBGA */

void DBGA_int(const char* name, const int* array, size_t len) {
    if (len == 0){
        printf(DBG_PREFIX"[]\n", name);
        return;
    }
    printf(DBG_PREFIX"[ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%d, ", array[i]);
    printf("%d ]\n", array[len - 1]);
}

void DBGA_size_t(const char* name, const size_t* array, size_t len) {
    if (len == 0){
        printf(DBG_PREFIX"[]\n", name);
        return;
    }
    printf(DBG_PREFIX"[ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%zu, ", array[i]);
    printf("%zu ]\n", array[len - 1]);
}

void DBGA_float(const char* name, const float* array, size_t len) {
    if (len == 0){
        printf(DBG_PREFIX"[]\n", name);
        return;
    }
    printf(DBG_PREFIX"[ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%f, ", array[i]);
    printf("%f ]\n", array[len - 1]);
}

void DBGA_double(const char* name, const double* array, size_t len) {
    if (len == 0){
        printf(DBG_PREFIX"[]\n", name);
        return;
    }
    printf(DBG_PREFIX"[ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%f, ", array[i]);
    printf("%f ]\n", array[len - 1]);
}

void DBGA_char(const char* name, const char* array, size_t len) {
    if (len == 0){
        printf(DBG_PREFIX"[]\n", name);
        return;
    }
    printf(DBG_PREFIX"[ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%c, ", array[i]);
    printf("%c ]\n", array[len - 1]);
}

void DBGA_str(const char* name, const char** array, size_t len) {
    if (len == 0){
        printf(DBG_PREFIX"[]\n", name);
        return;
    }
    printf(DBG_PREFIX"[ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%s, ", array[i]);
    printf("%s ]\n", array[len - 1]);
}

/* DBGC */

void DBGC_char(const char* name, const char c) {
    printf(DBG_PREFIX"%c\n", name, c);
}

void DBGC_char_ptr(const char* name, const char* c) {
    printf(DBG_PREFIX"%c\n", name, *c);
}

/* DBGS */

void DBGS_str(const char* name, const char* str) {
    int diff = strcmp(name, str);
    if (!diff)
        printf("%s\n", str);
    else
        printf(DBG_PREFIX"%s\n", name, str);
}

/* DBGMAT */

int DBGMAT_entry_width_int(const int entry) {
    int width = 0;
    int n = entry;
    if (entry < 0) {
        width++;
        n = -n;
    }
    while (n) {
        width++;
        n /= 10;
    }
    return width + (entry == 0);
}

int DBGMAT_entry_width_size_t(const size_t entry) {
    int width = 0;
    size_t n = entry;
    while (n) {
        width++;
        n /= 10;
    }
    return width + (entry == 0);
}

int DBGMAT_entry_width_float(const float entry) {
    int width = 0;
    float n = entry;
    if (entry < 0) {
        width++;
        n = -n;
    }
    while (n) {
        width++;
        n /= 10;
    }
    return width + (entry == 0);
}

int DBGMAT_entry_width_double(const double entry) {
    int width = 0;
    double n = entry;
    if (entry < 0) {
        width++;
        n = -n;
    }
    while (n) {
        width++;
        n /= 10;
    }
    return width + (entry == 0);
}

int DBGMAT_entry_width_char(__attribute__((unused)) const char entry) {
    return 1;
}

int DBGMAT_entry_width_str(const char* entry) {
    return strlen(entry);
}

#define _DBGMAT_entries_width(type) \
    for (size_t j = 0; j < n; j++) { \
        int col_max_width = 0; \
        for (size_t i = 0; i < m; i++) { \
            int width = CAT(DBGMAT_entry_width_, type)(mat[i][j]); \
            if (width > col_max_width) col_max_width = width; \
        } \
        max_width[j] = col_max_width; \
    }

void DBGMAT_entries_width_int(size_t n, size_t m, const int** mat, int max_width[m]) {
    _DBGMAT_entries_width(int)
}

void DBGMAT_entries_width_size_t(size_t n, size_t m, const size_t** mat, int max_width[m]) {
    _DBGMAT_entries_width(size_t)
}

void DBGMAT_entries_width_float(size_t n, size_t m, const float** mat, int max_width[m]) {
    _DBGMAT_entries_width(float)
}

void DBGMAT_entries_width_double(size_t n, size_t m, const double** mat, int max_width[m]) {
    _DBGMAT_entries_width(double)
}

void DBGMAT_entries_width_char(size_t n, size_t m, const char** mat, int max_width[m]) {
    _DBGMAT_entries_width(char)
}

void DBGMAT_entries_width_str(size_t n, size_t m, const char*** mat, int max_width[m]) {
    _DBGMAT_entries_width(str)
}

void DBGAMAT_entries_width_int(size_t n, size_t m, const int mat[n][m], int max_width[m]) {
    _DBGMAT_entries_width(int)
}

void DBGAMAT_entries_width_size_t(size_t n, size_t m, const size_t mat[n][m], int max_width[m]) {
    _DBGMAT_entries_width(size_t)
}

void DBGAMAT_entries_width_float(size_t n, size_t m, const float mat[n][m], int max_width[m]) {
    _DBGMAT_entries_width(float)
}

void DBGAMAT_entries_width_double(size_t n, size_t m, const double mat[n][m], int max_width[m]) {
    _DBGMAT_entries_width(double)
}

void DBGAMAT_entries_width_char(size_t n, size_t m, const char mat[n][m], int max_width[m]) {
    _DBGMAT_entries_width(char)
}

void DBGAMAT_entries_width_str(size_t n, size_t m, const char* mat[n][m], int max_width[m]) {
    _DBGMAT_entries_width(str)
}

#define _DBGMAT(type, format) \
    if (n == 0 && m == 0) { \
        printf(DBG_PREFIX"[]\n", name); \
        return; \
    } \
    int max_width[m]; \
    CAT(DBGMAT_entries_width_, type)(n, m, mat, max_width); \
    printf(DBG_PREFIX"\n", name); \
    for (size_t i = 0; i < n; i++) { \
        for (size_t j = 0; j < m; j++) { \
            for (size_t i = 0; i < DBGMAT_corners; i++) \
                printf("|"); \
            printf("%*.s"format"%*.s", DBGMAT_spaces, " ", max_width[j], mat[i][j], DBGMAT_spaces, " "); \
        } \
        for (size_t i = 0; i < DBGMAT_corners; i++) \
            printf("|"); \
        printf("\n"); \
    }

#define _DBGAMAT(type, format) \
    if (n == 0 && m == 0) { \
        printf(DBG_PREFIX"[]\n", name); \
        return; \
    } \
    int max_width[m]; \
    CAT(DBGAMAT_entries_width_, type)(n, m, mat, max_width); \
    printf(DBG_PREFIX"\n", name); \
    for (size_t i = 0; i < n; i++) { \
        for (size_t j = 0; j < m; j++) { \
            for (size_t i = 0; i < DBGMAT_corners; i++) \
                printf("|"); \
            printf("%*.s"format"%*.s", DBGMAT_spaces, " ", max_width[j], mat[i][j], DBGMAT_spaces, " "); \
        } \
        for (size_t i = 0; i < DBGMAT_corners; i++) \
            printf("|"); \
        printf("\n"); \
    }

void DBGMAT_int(const char* name, size_t n, size_t m, const int** mat) {
    _DBGMAT(int, "%*i")
}

void DBGMAT_size_t(const char* name, size_t n, size_t m, const size_t** mat) {
    _DBGMAT(size_t, "%*zu")
}

void DBGMAT_float(const char* name, size_t n, size_t m, const float** mat) {
    _DBGMAT(float, "%*f")
}

void DBGMAT_double(const char* name, size_t n, size_t m, const double** mat) {
    _DBGMAT(double, "%*f")
}

void DBGMAT_char(const char* name, size_t n, size_t m, const char** mat) {
    _DBGMAT(char, "%*c")
}

void DBGMAT_str(const char* name, size_t n, size_t m, const char*** mat) {
    _DBGMAT(str, "%*s")
}

void DBGAMAT_int(const char* name, size_t n, size_t m, const int mat[n][m]) {
    _DBGAMAT(int, "%*i")
}

void DBGAMAT_size_t(const char* name, size_t n, size_t m, const size_t mat[n][m]) {
    _DBGAMAT(size_t, "%*zu")
}

void DBGAMAT_float(const char* name, size_t n, size_t m, const float mat[n][m]) {
    _DBGAMAT(float, "%*f")
}

void DBGAMAT_double(const char* name, size_t n, size_t m, const double mat[n][m]) {
    _DBGAMAT(double, "%*f")
}

void DBGAMAT_char(const char* name, size_t n, size_t m, const char mat[n][m]) {
    _DBGAMAT(char, "%*c")
}

void DBGAMAT_str(const char* name, size_t n, size_t m, const char* mat[n][m]) {
    _DBGAMAT(str, "%*s")
}

#endif
