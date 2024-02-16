#include <time.h>

#include "src/jsonify.h"
#include "src/parser.h"
#include "src/prints.h"

#ifndef _WIN32

int main(int argc, char* argv[]) {
    if (argc < 2)
        return 1;
    Beatmap* bm = parse_beatmap((char*)argv[1]);
    jsonify_beatmap(bm, "out.json");
    return 0;
}

#else

#    include <windows.h>
int WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine,
            int nCmdShow) {
    if (!strcmp(lpCmdLine, ""))
        return 1;
    Beatmap* bm = parse_beatmap((char*)lpCmdLine);
    jsonify_beatmap(bm, "out.json");
    return 0;
}

#endif