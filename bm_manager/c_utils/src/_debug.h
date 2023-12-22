#define EXCLUDE
#ifndef EXCLUDE

#ifndef DEBUG_UTILS_H
#define DEBUG_UTILS_H

#include <stdlib.h>

#define report(fd, msg, ...) fprintf(fd, "%s: "msg"\n", __func__, ##__VA_ARGS__)

#ifndef DBG_PREFIX
#define DBG_PREFIX "(DBG):%s = "
#define DBG_VAR_NAME
#endif

/* DBGI */

void DBGI_int(const char* name, int n);
void DBGI_long(const char* name, long n);
void DBGI_long_long(const char* name, long long n);
void DBGI_size_t(const char* name, size_t n);
void DBGI_unsigned_char(const char* name, unsigned char n);
void DBGI_char(const char* name, char n);

#define DBGI(n) _Generic((n), \
        int: DBGI_int, \
        const int: DBGI_int, \
        long: DBGI_long, \
        const long: DBGI_long, \
        long long: DBGI_long_long, \
        const long long: DBGI_long_long, \
        size_t: DBGI_size_t, \
        const size_t: DBGI_size_t, \
        unsigned char: DBGI_unsigned_char, \
        const unsigned char: DBGI_unsigned_char, \
        char: DBGI_char, \
        const char: DBGI_char, \
        default: DBGI_int)(#n, n)

/* DBGBIN */

void DBGBIN_int(const char* name, int n);
void DBGBIN_unsigned_char(const char* name, unsigned char n);
void DBGBIN_char(const char* name, char n);
void DBGBIN_size_t(const char* name, size_t n);

#define DBGBIN(n) _Generic((n), \
        int: DBGBIN_int, \
        const int: DBGBIN_int, \
        size_t: DBGBIN_size_t, \
        const size_t: DBGBIN_size_t, \
        unsigned char: DBGBIN_unsigned_char, \
        const unsigned char: DBGBIN_unsigned_char, \
        char: DBGBIN_char, \
        const char: DBGBIN_char, \
        default: DBGBIN_int)(#n, n)

/* DBGA */

void DBGA_int(const char* name, const int* array, size_t len);
void DBGA_size_t(const char* name, const size_t* array, size_t len);
void DBGA_float(const char* name, const float* array, size_t len);
void DBGA_double(const char* name, const double* array, size_t len);
void DBGA_char(const char* name, const char* array, size_t len);
void DBGA_str(const char* name, const char** array, size_t len);

#define DBGA(array, length_array) _Generic((array), \
        int*: DBGA_int, \
        const int*: DBGA_int, \
        size_t*: DBGA_size_t, \
        const size_t*: DBGA_size_t, \
        float*: DBGA_float, \
        const float*: DBGA_float, \
        double*: DBGA_double, \
        const double*: DBGA_double, \
        char*: DBGA_char, \
        const char*: DBGA_char, \
        char**: DBGA_str, \
        const char**: DBGA_str, \
        default: DBGA_int)(#array, array, length_array)

/* DBGC */

void DBGC_char(const char* name, const char c);
void DBGC_char_ptr(const char* name, const char* c);

#define DBGC(c) _Generic((c), \
    char: DBGC_char, \
    const char: DBGC_char, \
    char*: DBGC_char_ptr, \
    const char*: DBGC_char_ptr, \
    default: DBGC_char)(#c, c)

/* DBGS */

void DBGS_str(const char* name, const char* str);

#define DBGS(str) DBGS_str(#str, str)

/* DBGMAT */

#ifndef DBGMAT_precision
#define DBGMAT_precision 2
#endif

#ifndef DBGMAT_corners
#define DBGMAT_corners 1
#endif

#ifndef DBGMAT_spaces
#define DBGMAT_spaces 1
#endif

#define _CAT(a, b) a ## b
#define CAT(a, b) _CAT(a, b)

int DBGMAT_entry_width_int(const int entry);
int DBGMAT_entry_width_size_t(const size_t entry);
int DBGMAT_entry_width_float(const float entry);
int DBGMAT_entry_width_double(const double entry);
int DBGMAT_entry_width_char(const char entry);
int DBGMAT_entry_width_str(const char* entry);

#define DBGMAT_entry_width(entry) _Generic((entry), \
        int: DBGMAT_entry_width_int, \
        const int: DBGMAT_entry_width_int, \
        size_t: DBGMAT_entry_width_size_t, \
        const size_t: DBGMAT_entry_width_size_t, \
        float: DBGMAT_entry_width_float, \
        const float: DBGMAT_entry_width_float, \
        double: DBGMAT_entry_width_double, \
        const double: DBGMAT_entry_width_double, \
        char: DBGMAT_entry_width_char, \
        const char: DBGMAT_entry_width_char, \
        char*: DBGMAT_entry_width_str, \
        const char*: DBGMAT_entry_width_str, \
        default: DBGMAT_entry_width_int)(entry)

void DBGMAT_entries_width_int(size_t n, size_t m, const int** mat, int max_width[m]);
void DBGMAT_entries_width_size_t(size_t n, size_t m, const size_t** mat, int max_width[m]);
void DBGMAT_entries_width_float(size_t n, size_t m, const float** mat, int max_width[m]);
void DBGMAT_entries_width_double(size_t n, size_t m, const double** mat, int max_width[m]);
void DBGMAT_entries_width_char(size_t n, size_t m, const char** mat, int max_width[m]);
void DBGMAT_entries_width_str(size_t n, size_t m, const char*** mat, int max_width[m]);

void DBGAMAT_entries_width_int(size_t n, size_t m, const int mat[n][m], int max_width[m]);
void DBGAMAT_entries_width_size_t(size_t n, size_t m, const size_t mat[n][m], int max_width[m]);
void DBGAMAT_entries_width_float(size_t n, size_t m, const float mat[n][m], int max_width[m]);
void DBGAMAT_entries_width_double(size_t n, size_t m, const double mat[n][m], int max_width[m]);
void DBGAMAT_entries_width_char(size_t n, size_t m, const char mat[n][m], int max_width[m]);
void DBGAMAT_entries_width_str(size_t n, size_t m, const char* mat[n][m], int max_width[m]);

#define DBGMAT_entries_width(mat, n, m, max_width) _Generic((mat), \
        int**: DBGMAT_entries_width_int, \
        const int**: DBGMAT_entries_width_int, \
        size_t**: DBGMAT_entries_width_size_t, \
        const size_t**: DBGMAT_entries_width_size_t, \
        float**: DBGMAT_entries_width_float, \
        const float**: DBGMAT_entries_width_float, \
        double**: DBGMAT_entries_width_double, \
        const double**: DBGMAT_entries_width_double, \
        char**: DBGMAT_entries_width_char, \
        const char**: DBGMAT_entries_width_char, \
        char***: DBGMAT_entries_width_str, \
        const char***: DBGMAT_entries_width_str, \
        default: DBGMAT_entries_width_int)(n, m, mat, max_width)

void DBGMAT_int(const char* name, size_t n, size_t m, const int** mat);
void DBGMAT_size_t(const char* name, size_t n, size_t m, const size_t** mat);
void DBGMAT_float(const char* name, size_t n, size_t m, const float** mat);
void DBGMAT_double(const char* name, size_t n, size_t m, const double** mat);
void DBGMAT_char(const char* name, size_t n, size_t m, const char** mat);
void DBGMAT_str(const char* name, size_t n, size_t m, const char*** mat);

void DBGAMAT_int(const char* name, size_t n, size_t m, const int mat[n][m]);
void DBGAMAT_size_t(const char* name, size_t n, size_t m, const size_t mat[n][m]);
void DBGAMAT_float(const char* name, size_t n, size_t m, const float mat[n][m]);
void DBGAMAT_double(const char* name, size_t n, size_t m, const double mat[n][m]);
void DBGAMAT_char(const char* name, size_t n, size_t m, const char mat[n][m]);
void DBGAMAT_str(const char* name, size_t n, size_t m, const char* mat[n][m]);

#define DBGMAT(width, height, mat) _Generic((mat), \
        int**: DBGMAT_int, \
        const int**: DBGMAT_int, \
        size_t**: DBGMAT_size_t, \
        const size_t**: DBGMAT_size_t, \
        float**: DBGMAT_float, \
        const float**: DBGMAT_float, \
        double**: DBGMAT_double, \
        const double**: DBGMAT_double, \
        char**: DBGMAT_char, \
        const char**: DBGMAT_char, \
        char***: DBGMAT_str, \
        const char***: DBGMAT_str, \
        int(*)[width]: DBGAMAT_int, \
        const int(*)[width]: DBGAMAT_int, \
        size_t(*)[width]: DBGAMAT_size_t, \
        const size_t(*)[width]: DBGAMAT_size_t, \
        float(*)[width]: DBGAMAT_float, \
        const float(*)[width]: DBGAMAT_float, \
        double(*)[width]: DBGAMAT_double, \
        const double(*)[width]: DBGAMAT_double, \
        char(*)[width]: DBGAMAT_char, \
        const char(*)[width]: DBGAMAT_char, \
        char*(*)[width]: DBGAMAT_str, \
        const char*(*)[width]: DBGAMAT_str, \
        default: DBGMAT_int)(#mat, height, width, mat)

#endif

#endif
