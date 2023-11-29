#ifndef BEATMAP_PARSER_H
#define BEATMAP_PARSER_H
#include "structs.h"

#define BUF_SIZE 32768

Beatmap* parse_beatmap(char* osuFile);

#endif