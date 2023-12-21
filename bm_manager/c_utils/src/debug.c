#include "debug.h"

#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <assert.h>
#include <stdarg.h>
#include <math.h>

/* DBGI */

void DBGI_int(const char* name, int n){
    printf("(DBG):%s = %i\n", name, n);
}

void DBGI_unsigned_char(const char* name, unsigned char n){
    printf("(DBG):%s = %u\n", name, n);
}

void DBGI_char(const char* name, char n){
    printf("(DBG):%s = %i\n", name, n);
}

void DBGI_size_t(const char* name, size_t n){
    printf("(DBG):%s = %zu\n", name, n);
}

/* DBGBIN */

static char bits[sizeof(size_t) * 8] = { 0 };

void DBGBIN_char(const char* name, char n)
{
    int nb_bits = sizeof(char) * 8;
    printf("(DBG):%s = ", name);
    for (int i = 0; i < nb_bits; i++){
        bits[i] = n % 2 + '0';
        n /= 2;
    }
    for (int i = nb_bits - 1; i >= 0; i--)
        putchar(bits[i]);
    putchar('\n');
}

void DBGBIN_unsigned_char(const char* name, unsigned char n)
{
    int nb_bits = sizeof(unsigned char) * 8;
    printf("(DBG):%s = ", name);
    for (int i = 0; i < nb_bits; i++){
        bits[i] = n % 2 + '0';
        n /= 2;
    }
    for (int i = nb_bits - 1; i >= 0; i--)
        putchar(bits[i]);
    putchar('\n');
}

void DBGBIN_int(const char* name, int n)
{
    int nb_bits = sizeof(int) * 8;
    printf("(DBG):%s = ", name);
    for (int i = 0; i < nb_bits; i++){
        bits[i] = n % 2 + '0';
        n /= 2;
    }
    for (int i = nb_bits - 1; i >= 0; i--)
        putchar(bits[i]);
    putchar('\n');
}

void DBGBIN_size_t(const char* name, size_t n)
{
    int nb_bits = sizeof(size_t) * 8;
    printf("(DBG):%s = ", name);
    for (int i = 0; i < nb_bits; i++){
        bits[i] = n % 2 + '0';
        n /= 2;
    }
    for (int i = nb_bits - 1; i >= 0; i--)
        putchar(bits[i]);
    putchar('\n');
}

/* DBGA */

void DBGA_int(const char* name, const int* array, size_t len){
    if (len == 0){
        printf("(DBG):%s = []\n", name);
        return;
    }
    printf("(DBG):%s = [ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%d, ", array[i]);
    printf("%d ]\n", array[len - 1]);
}

void DBGA_size_t(const char* name, const size_t* array, size_t len){
    if (len == 0){
        printf("(DBG):%s = []\n", name);
        return;
    }
    printf("(DBG):%s = [ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%zu, ", array[i]);
    printf("%zu ]\n", array[len - 1]);
}

void DBGA_float(const char* name, const float* array, size_t len){
    if (len == 0){
        printf("(DBG):%s = []\n", name);
        return;
    }
    printf("(DBG):%s = [ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%f, ", array[i]);
    printf("%f ]\n", array[len - 1]);
}

void DBGA_double(const char* name, const double* array, size_t len){
    if (len == 0){
        printf("(DBG):%s = []\n", name);
        return;
    }
    printf("(DBG):%s = [ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%f, ", array[i]);
    printf("%f ]\n", array[len - 1]);
}

void DBGA_char(const char* name, const char* array, size_t len){
    if (len == 0){
        printf("(DBG):%s = []\n", name);
        return;
    }
    printf("(DBG):%s = [ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%c, ", array[i]);
    printf("%c ]\n", array[len - 1]);
}

void DBGA_str(const char* name, const char** array, size_t len){
    if (len == 0){
        printf("(DBG):%s = []\n", name);
        return;
    }
    printf("(DBG):%s = [ ", name);
    for (size_t i = 0; i < len - 1; i = i + 1)
        printf("%s, ", array[i]);
    printf("%s ]\n", array[len - 1]);
}

/* DBGC */

void DBGC_char(const char* name, const char* c){
    int diff = strcmp(name, c);
    if (diff >= -1 || diff <= 1)
        printf("%c\n", *c);
    else
        printf("(DBG):%s = %c\n", name, *c);
}

/* DBGS */

void DBGS_str(const char* name, const char* str){
    int diff = strcmp(name, str);
    if (!diff)
        printf("%s\n", str);
    else
        printf("(DBG):%s = %s\n", name, str);
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

#define _DBGMAT_entries_width(type, n, m, mat) \
    int max_width = 0; \
    for (size_t i = 0; i < n; i++) { \
        for (size_t j = 0; j < m; j++) { \
            int width = CAT(DBGMAT_entry_width_, type)(mat[i][j]); \
            if (width > max_width) max_width = width; \
        } \
    }

int DBGMAT_entries_width_int(size_t n, size_t m, const int** mat) {
    _DBGMAT_entries_width(int, n, m, mat)
    return max_width;
}

int DBGMAT_entries_width_size_t(size_t n, size_t m, const size_t** mat) {
    _DBGMAT_entries_width(size_t, n, m, mat)
    return max_width;
}

int DBGMAT_entries_width_float(size_t n, size_t m, const float** mat) {
    _DBGMAT_entries_width(float, n, m, mat)
    return max_width;
}

int DBGMAT_entries_width_double(size_t n, size_t m, const double** mat) {
    _DBGMAT_entries_width(double, n, m, mat)
    return max_width;
}

int DBGMAT_entries_width_char(size_t n, size_t m, const char** mat) {
    _DBGMAT_entries_width(char, n, m, mat)
    return max_width;
}

int DBGMAT_entries_width_str(size_t n, size_t m, const char*** mat) {
    _DBGMAT_entries_width(str, n, m, mat)
    return max_width;
}

int DBGAMAT_entries_width_int(size_t n, size_t m, const int mat[n][m]) {
    _DBGMAT_entries_width(int, n, m, mat)
    return max_width;
}

int DBGAMAT_entries_width_size_t(size_t n, size_t m, const size_t mat[n][m]) {
    _DBGMAT_entries_width(size_t, n, m, mat)
    return max_width;
}

int DBGAMAT_entries_width_float(size_t n, size_t m, const float mat[n][m]) {
    _DBGMAT_entries_width(float, n, m, mat)
    return max_width;
}

int DBGAMAT_entries_width_double(size_t n, size_t m, const double mat[n][m]) {
    _DBGMAT_entries_width(double, n, m, mat)
    return max_width;
}

int DBGAMAT_entries_width_char(size_t n, size_t m, const char mat[n][m]) {
    _DBGMAT_entries_width(char, n, m, mat)
    return max_width;
}

int DBGAMAT_entries_width_str(size_t n, size_t m, const char* mat[n][m]) {
    _DBGMAT_entries_width(str, n, m, mat)
    return max_width;
}

#if DBGMAT_corners == 1

#if DBGMAT_spaces == 1

#define _DBGMAT(name, type, n, m, mat, format) \
    if (n == 0 && m == 0) { \
        printf("(DBG):%s = []\n", name); \
        return; \
    } \
    int max_width = CAT(DBGMAT_entries_width_, type)(n, m, mat); \
    printf("(DBG):%s =\n", name); \
    for (size_t i = 0; i < n; i++){ \
        for (size_t j = 0; j < m; j++) \
            printf("| "format" ", max_width, mat[i][j]); \
        printf("|\n"); \
    }

#define _DBGAMAT(name, type, n, m, mat, format) \
    if (n == 0 && m == 0) { \
        printf("(DBG):%s = []\n", name); \
        return; \
    } \
    int max_width = CAT(DBGAMAT_entries_width_, type)(n, m, mat); \
    printf("(DBG):%s =\n", name); \
    for (size_t i = 0; i < n; i++){ \
        for (size_t j = 0; j < m; j++) \
            printf("| "format" ", max_width, mat[i][j]); \
        printf("|\n"); \
    }

#else

#define _DBGMAT(name, type, n, m, mat, format) \
    if (n == 0 && m == 0) { \
        printf("(DBG):%s = []\n", name); \
        return; \
    } \
    int max_width = CAT(DBGMAT_entries_width_, type)(n, m, mat); \
    printf("(DBG):%s =\n", name); \
    for (size_t i = 0; i < n; i++){ \
        for (size_t j = 0; j < m; j++) \
            printf("|"format, max_width, mat[i][j]); \
        printf("|\n"); \
    }

#define _DBGAMAT(name, type, n, m, mat, format) \
    if (n == 0 && m == 0) { \
        printf("(DBG):%s = []\n", name); \
        return; \
    } \
    int max_width = CAT(DBGAMAT_entries_width_, type)(n, m, mat); \
    printf("(DBG):%s =\n", name); \
    for (size_t i = 0; i < n; i++){ \
        for (size_t j = 0; j < m; j++) \
            printf("|"format, max_width, mat[i][j]); \
        printf("|\n"); \
    }

#endif

#else

#if DBGMAT_spaces == 1

#define _DBGMAT(name, type, n, m, mat, format) \
    if (n == 0 && m == 0) { \
        printf("(DBG):%s = []\n", name); \
        return; \
    } \
    int max_width = CAT(DBGMAT_entries_width_, type)(n, m, mat); \
    printf("(DBG):%s =\n", name); \
    for (size_t i = 0; i < n; i++){ \
        for (size_t j = 0; j < m; j++) \
            printf(" "format" ", max_width, mat[i][j]); \
        printf("\n"); \
    }

#define _DBGAMAT(name, type, n, m, mat, format) \
    if (n == 0 && m == 0) { \
        printf("(DBG):%s = []\n", name); \
        return; \
    } \
    int max_width = CAT(DBGAMAT_entries_width_, type)(n, m, mat); \
    printf("(DBG):%s =\n", name); \
    for (size_t i = 0; i < n; i++){ \
        for (size_t j = 0; j < m; j++) \
            printf(" "format" ", max_width, mat[i][j]); \
        printf("\n"); \
    }

#else

#define _DBGMAT(name, type, n, m, mat, format) \
    if (n == 0 && m == 0) { \
        printf("(DBG):%s = []\n", name); \
        return; \
    } \
    int max_width = CAT(DBGMAT_entries_width_, type)(n, m, mat); \
    printf("(DBG):%s =\n", name); \
    for (size_t i = 0; i < n; i++){ \
        for (size_t j = 0; j < m; j++) \
            printf(format, max_width, mat[i][j]); \
        printf("\n"); \
    }

#define _DBGAMAT(name, type, n, m, mat, format) \
    if (n == 0 && m == 0) { \
        printf("(DBG):%s = []\n", name); \
        return; \
    } \
    int max_width = CAT(DBGAMAT_entries_width_, type)(n, m, mat); \
    printf("(DBG):%s =\n", name); \
    for (size_t i = 0; i < n; i++){ \
        for (size_t j = 0; j < m; j++) \
            printf(format, max_width, mat[i][j]); \
        printf("\n"); \
    }

#endif

#endif

void DBGMAT_int(const char* name, size_t n, size_t m, const int** mat) {
    _DBGMAT(name, int, n, m, mat, "%*i")
}

void DBGMAT_size_t(const char* name, size_t n, size_t m, const size_t** mat) {
    _DBGMAT(name, size_t, n, m, mat, "%*zu")
}

void DBGMAT_float(const char* name, size_t n, size_t m, const float** mat) {
    _DBGMAT(name, float, n, m, mat, "%*f")
}

void DBGMAT_double(const char* name, size_t n, size_t m, const double** mat) {
    _DBGMAT(name, double, n, m, mat, "%*f")
}

void DBGMAT_char(const char* name, size_t n, size_t m, const char** mat) {
    _DBGMAT(name, char, n, m, mat, "%*c")
}

void DBGMAT_str(const char* name, size_t n, size_t m, const char*** mat) {
    _DBGMAT(name, str, n, m, mat, "%*s")
}

void DBGAMAT_int(const char* name, size_t n, size_t m, const int mat[n][m]) {
    _DBGAMAT(name, int, n, m, mat, "%*i")
}

void DBGAMAT_size_t(const char* name, size_t n, size_t m, const size_t mat[n][m]) {
    _DBGAMAT(name, size_t, n, m, mat, "%*zu")
}

void DBGAMAT_float(const char* name, size_t n, size_t m, const float mat[n][m]) {
    _DBGAMAT(name, float, n, m, mat, "%*f")
}

void DBGAMAT_double(const char* name, size_t n, size_t m, const double mat[n][m]) {
    _DBGAMAT(name, double, n, m, mat, "%*f")
}

void DBGAMAT_char(const char* name, size_t n, size_t m, const char mat[n][m]) {
    _DBGAMAT(name, char, n, m, mat, "%*c")
}

void DBGAMAT_str(const char* name, size_t n, size_t m, const char* mat[n][m]) {
    _DBGAMAT(name, str, n, m, mat, "%*s")
}
