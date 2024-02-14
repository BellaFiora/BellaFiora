#ifndef BEATMAP_PARSER_PRINTS_H
#define BEATMAP_PARSER_PRINTS_H

#include "structs.h"

void print_general(const General* general);
void print_editor(const Editor* editor);
void print_metadata(const Metadata* metadata);
void print_difficulty(const Difficulty* difficulty);
void print_event(const Event* event);
void print_events(const List* events);
void print_timingPoint(const TimingPoint* timingPoint);
void print_timingPoints(const List* timingPoints);
void print_colour(const BeatmapColour* beatmapColour);
void print_colours(const List* beatmapColours);
void print_hitSound(const HitSound* hitSound);
void print_hitSample(const HitSample* hitSample);
void print_slider(const Slider* slider);
void print_spinner(const Spinner* spinner);
void print_hold(const Hold* hold);
void print_hitObject(const HitObject* hitObject);
void print_hitObjects(const List* hitObjects);
void print_beatmap(Beatmap* beatmap);

#endif
