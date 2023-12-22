#include "debug.h"

#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <assert.h>
#include <stdarg.h>
#include <math.h>

// ---------- DBG ----------

/* DBGI */

#define __DBGI(format) dbgprintf(format"\n", n);
#define _DBGI(type, format) dbgdef(void, CAT(DBGI_, type), type n) { __DBGI(format) }

_DBGI(int, "%i")
_DBGI(size_t, "%zu")
_DBGI(float, "%f")
_DBGI(double, "%f")
_DBGI(char, "%i")
_DBGI(long, "%ld")
dbgdef(void, DBGI_long_long, long long n) { __DBGI("%lld") }
dbgdef(void, DBGI_unsigned_char, unsigned char n) { __DBGI("%u") }

/* DBGBIN */

static char bits[sizeof(size_t) * 8] = { 0 };

#define __DBGBIN(type) \
    int nb_bits = sizeof(type) * 8; \
    dbgprintf(""); \
    for (int i = 0; i < nb_bits; i++){ \
        bits[i] = n % 2 + '0'; \
        n /= 2; \
    } \
    for (int i = nb_bits - 1; i >= 0; i--) \
        putchar(bits[i]); \
    putchar('\n');

#define _DBGBIN(type) dbgdef(void, CAT(DBGBIN_, type), type n) { __DBGBIN(type) }

_DBGBIN(int)
_DBGBIN(size_t)
_DBGBIN(char)
_DBGBIN(long)
dbgdef(void, DBGBIN_long_long, long long n) { __DBGBIN(long long) }
dbgdef(void, DBGBIN_unsigned_char, unsigned char n) { __DBGBIN(unsigned char) }

/* DBGA */

#define __DBGA(format) \
    if (len == 0){ \
        dbgprintf("[]\n"); \
        return; \
    } \
    dbgprintf("[ "); \
    for (size_t i = 0; i < len - 1; i++) \
        printf(format", ", array[i]); \
    printf(format" ]\n", array[len - 1]);

#define _DBGA(type, format) dbgdef(void, CAT(DBGA_, type), const type* array, size_t len) { __DBGA(format) }

_DBGA(int, "%i")
_DBGA(size_t, "%zu")
_DBGA(float, "%f")
_DBGA(double, "%f")
_DBGA(char, "%c")
dbgdef(void, DBGA_str, const char** array, size_t len) { __DBGA("%s") }

/* DBGC */

dbgdef(void, DBGC_char, const char c) { dbgprintf("%c\n", c); }
dbgdef(void, DBGC_char_ptr, const char*c) { dbgprintf("%c\n", *c); }

/* DBGS */

dbgdef(void, DBGS_str, const char* str) { dbgprintf("%s\n", str); }

/* DBGMAT */

#define DBGMAT_entry_width_check \
    if (entry < 0) { \
        width++; \
        n = -n; \
    }

#define DBGMAT_entry_width_body \
    while (n) { \
        width++; \
        n /= 10; \
    } \
    return width + (entry == 0);

int DBGMAT_entry_width_int(const int entry) {
    int width = 0;
    int n = entry;
    DBGMAT_entry_width_check
    DBGMAT_entry_width_body
}

int DBGMAT_entry_width_size_t(const size_t entry) {
    int width = 0;
    size_t n = entry;
    DBGMAT_entry_width_body
}

int DBGMAT_entry_width_float(const float entry) {
    int width = 0;
    float n = entry;
    DBGMAT_entry_width_check
    DBGMAT_entry_width_body
}

int DBGMAT_entry_width_double(const double entry) {
    int width = 0;
    double n = entry;
    DBGMAT_entry_width_check
    DBGMAT_entry_width_body
}

int DBGMAT_entry_width_char(__attribute__((unused)) const char entry) { return 1; }

int DBGMAT_entry_width_str(const char* entry) { return strlen(entry); }

#define __DBGMAT_entries_width(type) \
    for (size_t j = 0; j < n; j++) { \
        int col_max_width = 0; \
        for (size_t i = 0; i < m; i++) { \
            int width = CAT(DBGMAT_entry_width_, type)(mat[i][j]); \
            if (width > col_max_width) col_max_width = width; \
        } \
        max_width[j] = col_max_width; \
    }

#define _DBGMAT_entries_width(type) void CAT(DBGMAT_entries_width_, type)(size_t n, size_t m, const type** mat, int max_width[m]) { __DBGMAT_entries_width(type) }
#define _DBGAMAT_entries_width(type) void CAT(DBGAMAT_entries_width_, type)(size_t n, size_t m, const type mat[n][m], int max_width[m]) { __DBGMAT_entries_width(type) }

_DBGMAT_entries_width(int)
_DBGMAT_entries_width(size_t)
_DBGMAT_entries_width(float)
_DBGMAT_entries_width(double)
_DBGMAT_entries_width(char)
void DBGMAT_entries_width_str(size_t n, size_t m, const char*** mat, int max_width[m]) { __DBGMAT_entries_width(str) }

_DBGAMAT_entries_width(int)
_DBGAMAT_entries_width(size_t)
_DBGAMAT_entries_width(float)
_DBGAMAT_entries_width(double)
_DBGAMAT_entries_width(char)
void DBGAMAT_entries_width_str(size_t n, size_t m, const char* mat[n][m], int max_width[m]) { __DBGMAT_entries_width(str) }

#define __DBGMAT_init \
    if (n == 0 && m == 0) { \
        dbgprintf("[]\n"); \
        return; \
    } \
    int max_width[m];

#define __DBGMAT_body(format) \
    dbgprintf("\n"); \
    for (size_t i = 0; i < n; i++) { \
        for (size_t j = 0; j < m; j++) { \
            for (size_t i = 0; i < DBGMAT_corners; i++) printf("|"); \
            printf("%*.s"format"%*.s", DBGMAT_spaces, " ", max_width[j], mat[i][j], DBGMAT_spaces, " "); \
        } \
        for (size_t i = 0; i < DBGMAT_corners; i++) printf("|"); \
        printf("\n"); \
    }

#define _DBGMAT(type, format) \
dbgdef(void, CAT(DBGMAT_, type), size_t n, size_t m, const type** mat) { \
    __DBGMAT_init \
    CAT(DBGMAT_entries_width_, type)(n, m, mat, max_width); \
    __DBGMAT_body(format) \
}

#define _DBGAMAT(type, format) \
dbgdef(void, CAT(DBGAMAT_, type), size_t n, size_t m, const type mat[n][m]) { \
    __DBGMAT_init \
    CAT(DBGAMAT_entries_width_, type)(n, m, mat, max_width); \
    __DBGMAT_body(format) \
}

_DBGMAT(int, "%*i")
_DBGMAT(size_t, "%*zu")
_DBGMAT(float, "%*f")
_DBGMAT(double, "%*f")
_DBGMAT(char, "%*c")
dbgdef(void, DBGMAT_str, size_t n, size_t m, const char*** mat) {
    __DBGMAT_init
    DBGMAT_entries_width_str(n, m, mat, max_width);
    __DBGMAT_body("%*s")
}

_DBGAMAT(int, "%*i")
_DBGAMAT(size_t, "%*zu")
_DBGAMAT(float, "%*f")
_DBGAMAT(double, "%*f")
_DBGAMAT(char, "%*c")
dbgdef(void, DBGAMAT_str, size_t n, size_t m, const char* mat[n][m]) {
    __DBGMAT_init
    DBGAMAT_entries_width_str(n, m, mat, max_width);
    __DBGMAT_body("%*s")
}

// ---------- MISCELLANEOUS ----------


