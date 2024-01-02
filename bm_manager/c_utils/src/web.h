#ifndef WEB_UTILS_H
#define WEB_UTILS_H

#include <stdlib.h>

//#include <sql.h>

struct MemoryStruct {
    char *data;
    size_t size;
};

extern struct MemoryStruct curl_response;

void set_curl_headers(void* _, ...);
// return 0 if no error
int curl_request(const char* method, const char* url, ...);

#endif
