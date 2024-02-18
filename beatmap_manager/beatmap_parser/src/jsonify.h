#ifndef JSONIFY_H
#define JSONIFY_H
#include "structs.h"

void jsonify_beatmap_to_file_pretty(Beatmap* beatmap, FILE* fp);
void jsonify_beatmap_pretty(Beatmap* beatmap, char* path);
void jsonify_beatmap_to_file(Beatmap* beatmap, FILE* fp);
void jsonify_beatmap(Beatmap* beatmap, char* path);

#endif