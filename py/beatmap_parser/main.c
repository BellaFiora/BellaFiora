#include <time.h>

#include "src/parser.h"
#include "src/prints.h"
#include "src/jsonify.h"

#define MAIN_BODY_LINUX \
	if (argc < 2)\
		return 1;\
	Beatmap* bm = parse_beatmap((char*)argv[1]);\
	jsonify_beatmap(bm, "out");

#define MAIN_BODY_WIN \
	if (!strcmp(lpCmdLine, ""))\
		return 1;\
	Beatmap* bm = parse_beatmap((char*)lpCmdLine);\
	jsonify_beatmap(bm, "out");

#ifndef _WIN32

int main(int argc, char* argv[]){
	MAIN_BODY_LINUX
	return 0;
}

#else

#include <windows.h>
int WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow){
	MAIN_BODY_WIN
	return 0;
}

#endif