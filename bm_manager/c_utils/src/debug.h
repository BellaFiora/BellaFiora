#ifndef DEBUG_UTILS_H
#define DEBUG_UTILS_H

#include <stdlib.h>

// ---------- DBG ----------

#define _CAT(a, b) a ## b
#define CAT(a, b) _CAT(a, b)

#define DBG_PREFIX "(DBG):%s = "
// | comment if DBG_PREFIX does not contain %s
// | it only allows for one or zero %s, it corresponds to the local variable name
// | example: for (int i = 0; i < 3; i++) { DBGI(i); } will print:
// | (DBG):i = 0
// | (DBG):i = 1
// | (DBG):i = 2
// | and yes doing DBGI(5) will print (DBG):5 = 5 as stupid as it looks
// v
#define DBG_VAR_NAME

#ifdef DBG_VAR_NAME

#define dbgdec(ret, fname, ...) ret fname(const char* name, ##__VA_ARGS__);
#define dbgmac_args(scase, ...) #scase, ##__VA_ARGS__

#define dbgprintf(format, ...) printf(DBG_PREFIX format, name, ##__VA_ARGS__)
#define dbgdef(ret, fname, ...) ret fname(const char* name, ##__VA_ARGS__)

#else

#define dbgdec(ret, fname, ...) ret fname(__VA_ARGS__);
#define dbgmac_args(scase, ...) __VA_ARGS__

#define dbgprintf(format, ...) printf(DBG_PREFIX format, ##__VA_ARGS__)
#define dbgdef(ret, fname, ...) ret fname(__VA_ARGS__)

#endif

/* DBGI */

#define dbgdec_DBGI(type) dbgdec(void, CAT(DBGI_, type), type n)

dbgdec_DBGI(int)
dbgdec_DBGI(size_t)
dbgdec_DBGI(float)
dbgdec_DBGI(double)
dbgdec_DBGI(char)
dbgdec_DBGI(long)
dbgdec(void, DBGI_long_long, long long n)
dbgdec(void, DBGI_unsigned_char, unsigned char n)

#define DBGI(n) _Generic((n), \
        int: DBGI_int, \
        const int: DBGI_int, \
        size_t: DBGI_size_t, \
        const size_t: DBGI_size_t, \
        float: DBGI_float, \
        const float: DBGI_float, \
        double: DBGI_double, \
        const double: DBGI_double, \
        char: DBGI_char, \
        const char: DBGI_char, \
        long: DBGI_long, \
        const long: DBGI_long, \
        long long: DBGI_long_long, \
        const long long: DBGI_long_long, \
        unsigned char: DBGI_unsigned_char, \
        const unsigned char: DBGI_unsigned_char, \
        default: DBGI_int)(dbgmac_args(n, n))

/* DBGBIN */

#define dbgdec_DBGBIN(type) dbgdec(void, CAT(DBGBIN_, type), type n)

dbgdec_DBGBIN(int)
dbgdec_DBGBIN(size_t)
dbgdec_DBGBIN(char)
dbgdec_DBGBIN(long)
dbgdec(void, DBGBIN_long_long, long long n)
dbgdec(void, DBGBIN_unsigned_char, unsigned char n)

#define DBGBIN(n) _Generic((n), \
        int: DBGBIN_int, \
        const int: DBGBIN_int, \
        size_t: DBGBIN_size_t, \
        const size_t: DBGBIN_size_t, \
        char: DBGBIN_char, \
        const char: DBGBIN_char, \
        long: DBGBIN_long, \
        const long: DBGBIN_long, \
        long long: DBGBIN_long_long, \
        const long long: DBGBIN_long_long, \
        unsigned char: DBGBIN_unsigned_char, \
        const unsigned char: DBGBIN_unsigned_char, \
        default: DBGBIN_int)(dbgmac_args(n, n))

/* DBGA */

#define dbgdec_DBGA(type) dbgdec(void, CAT(DBGA_, type), const type* array, size_t len)

dbgdec_DBGA(int)
dbgdec_DBGA(size_t)
dbgdec_DBGA(float)
dbgdec_DBGA(double)
dbgdec_DBGA(char)
dbgdec(void, DBGA_str, const char** array, size_t len)

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
        default: DBGA_int)(dbgmac_args(array, array, length_array))

/* DBGC */

dbgdec(void, DBGC_char, const char c)
dbgdec(void, DBGC_char_ptr, const char* c)

#define DBGC(c) _Generic((c), \
    char: DBGC_char, \
    const char: DBGC_char, \
    char*: DBGC_char_ptr, \
    const char*: DBGC_char_ptr, \
    default: DBGC_char)(dbgmac_args(c, c))

/* DBGS */

dbgdec(void, DBGS_char, const char* str)
dbgdec(void, DBGS_char_array, const char str[])

#define DBGS(string) _Generic((string), \
    char*: DBGS_char, \
    const char*: DBGS_char, \
    char[]: DBGS_char_array, \
    const char[]: DBGS_char_array, \
    default: DBGS_char)(dbgmac_args(string, string))

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

#define dbgdec_DBGMAT(type) dbgdec(void, CAT(DBGMAT_, type), size_t n, size_t m, const type** mat)

dbgdec_DBGMAT(int)
dbgdec_DBGMAT(size_t)
dbgdec_DBGMAT(float)
dbgdec_DBGMAT(double)
dbgdec_DBGMAT(char)
dbgdec(void, DBGMAT_str, size_t n, size_t m, const char*** mat)

#define dbgdec_DBGAMAT(type) dbgdec(void, CAT(DBGAMAT_, type), size_t n, size_t m, const type mat[n][m])

dbgdec_DBGAMAT(int)
dbgdec_DBGAMAT(size_t)
dbgdec_DBGAMAT(float)
dbgdec_DBGAMAT(double)
dbgdec_DBGAMAT(char)
dbgdec(void, DBGAMAT_str, size_t n, size_t m, const char* mat[n][m])

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
        default: DBGMAT_int)(dbgmac_args(mat, height, width, mat))

// ---------- MISCELLANEOUS ----------

#define report(fd, msg, ...) fprintf(fd, "%s: "msg"\n", __func__, ##__VA_ARGS__)

#endif /* DEBUG_UTILS_H */
