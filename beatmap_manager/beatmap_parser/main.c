#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

#include "src/jsonify.h"
#include "src/parser.h"
#include "src/prints.h"

// char request[1024];

// void wait_request() {
// 	if (fgets(request, sizeof(request), stdin) == NULL) {
// 		fprintf(stderr, "fgets failed\n");
// 		exit(1);
// 	}
// }

// int loop() {
// 	wait_request();
// 	if (strcmp(request, "exit") == 0)
// 		return 0;
// 	putc('[', stdout);
// 	handle_request();
// 	wait_request();
// 	while (strcmp(request, "exit") != 0) {
// 		putc(',', stdout);
// 		handle_request();
// 		wait_request();
// 	}
// 	putc(']', stdout);
// 	return 0;
// }

void handle_request(char* request) {
    if (access(request, F_OK) == -1) { fprintf(stderr, "handle_request: %s not found\n", request); exit(1); }
	Beatmap* bm = parse_beatmap(request);
	if (bm == NULL) { fprintf(stderr, "handle_request: parse_beatmap failed\n"); exit(1); }
	char* dot_ptr = strchr(request, '.');
	if (dot_ptr == NULL) { strcpy(request + strlen(request), ".json"); } else { strcpy(dot_ptr, ".json"); }
	FILE* file = fopen(request, "w");
	if (file == NULL) { fprintf(stderr, "handle_request: failed to open file for writing\n"); exit(1); }
	jsonify_beatmap_to_file_pretty(bm, file);
	fclose(file);
	free_beatmap(bm);
}

#ifndef _WIN32

int main(int argc, char** argv) {
	if (argc <= 1)
		return 0;
	for (int i = 1; i < argc; i++)
		handle_request(argv[i]);
	// wait_request();
	// handle_request();
	// return loop();
	return 0;
}

#else

#	include <windows.h>
int WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine,
			int nCmdShow) {
	return loop();
}

#endif
