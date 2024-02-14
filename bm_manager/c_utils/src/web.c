#include "web.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <errno.h>

// sudo apt install libcurl4-openssl-dev
#include <curl/curl.h>

static CURL *curl = NULL;
struct MemoryStruct curl_response;

static size_t WriteMemoryCallback(void *response_content, size_t size, size_t nmemb, void *userp) {
	size_t realsize = size * nmemb;
	struct MemoryStruct *ptr = (struct MemoryStruct *)userp;
	char *tmp = realloc(ptr->data, ptr->size + realsize + 1);
	if(tmp == NULL) {
		fprintf(stderr, "WriteMemoryCallback: realloc failed\n");
		return 0;
	}
	ptr->data = tmp;
	memcpy(&(ptr->data[ptr->size]), response_content, realsize);
	ptr->size += realsize;
	ptr->data[ptr->size] = '\0';
	return realsize;
}

__attribute__ ((constructor)) static void __curl_init(void) {
	// proper init
	if (curl_global_init(CURL_GLOBAL_DEFAULT)) {
		fprintf(stderr, "curl_init: curl_global_init failed\n");
		return;
	}
	curl = curl_easy_init();
	if (!curl) {
		fprintf(stderr, "curl_init: curl_easy_init failed\n");
		return;
	}
	curl_response.data = NULL;
	curl_response.size = 0;
	// WriteMemoryCallback will be called internally
	// whenever data is received and stored in curl_response.data
	// and curl_response.size updated accordingly
	curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteMemoryCallback);
	curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)&curl_response);
	// follow redirections
	curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
	// HTTP/1.1
	curl_easy_setopt(curl, CURLOPT_HTTP_VERSION, (long)CURL_HTTP_VERSION_1_1);
}

__attribute__ ((destructor)) static void __curl_free(void) {
	if (curl)
		curl_easy_cleanup(curl);
	if (curl_response.data)
		free(curl_response.data);
}

void set_curl_headers(__attribute__ ((unused)) void* _, ...) {
	va_list args; va_start(args, _);
	struct curl_slist *headers = NULL;
	const char *header = NULL;
	while ((header = va_arg(args, const char*)))
		headers = curl_slist_append(headers, header);
	va_end(args);
	curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
}

// response is available in curl_response.data and is of size curl_response.size
// each varg is of the format "key: value"
// example:
// curl_request("GET", "https://osu.ppy.sh", "Connection: keep-alive", "Accept-Language: en-US,en;q=0.5")
// equivalent in python:
// requests.request('GET', 'https://osu.ppy.sh', headers={"Connection": "keep-alive", "Accept-Language": "en-US,en;q=0.5"})
int curl_request(const char* method, const char* url, ...) {
	// set method
	if (!strcmp(method, "GET"))
		curl_easy_setopt(curl, CURLOPT_HTTPGET, 1L);
	else if (!strcmp(method, "POST"))
		curl_easy_setopt(curl, CURLOPT_POST, 1L);
	else if (!strcmp(method, "HEAD"))
		curl_easy_setopt(curl, CURLOPT_NOBODY, 1L);
	else
	{
		fprintf(stderr, "curl_request: unsupported method: %s\n", method);
		errno = EINVAL;
		return 1;
	}
	// set headers
	va_list headers; va_start(headers, url);
	set_curl_headers(curl, headers);
	va_end(headers);
	// set url
	curl_easy_setopt(curl, CURLOPT_URL, url);
	// perform the request
	CURLcode res = curl_easy_perform(curl);
	if (res != CURLE_OK) {
		fprintf(stderr, "curl_request: %s\n", curl_easy_strerror(res));
		return 1;
	}
	return 0;
}
