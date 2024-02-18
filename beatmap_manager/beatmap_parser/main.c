#include <time.h>
#include <stdlib.h>
#include <string.h>

#include "src/jsonify.h"
#include "src/parser.h"
#include "src/prints.h"

char request[1024];

void wait_request() {
	if (fgets(request, sizeof(request), stdin) == NULL) {
		fprintf(stderr, "fgets failed\n");
		exit(1);
	}
}

void handle_request() {
	request[strlen(request) - 1] = '\0';
	Beatmap* bm = parse_beatmap(request);
	if (bm == NULL) {
		fprintf(stderr, "parse_beatmap failed\n");
		exit(1);
	}
	jsonify_beatmap_to_file(bm, stdout);
	free_beatmap(bm);
}

int loop() {
	wait_request();
	if (strcmp(request, "exit") == 0)
		return 0;
	putc('[', stdout);
	handle_request();
	wait_request();
	while (strcmp(request, "exit") != 0) {
		putc(',', stdout);
		handle_request();
		wait_request();
	}
	putc(']', stdout);
	return 0;
}

#ifndef _WIN32

int main(void) {
	return loop();
}

#else

#	include <windows.h>
int WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine,
			int nCmdShow) {
	return loop();
}

#endif
