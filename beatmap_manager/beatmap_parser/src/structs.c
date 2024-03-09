#include "structs.h"

#include <stdlib.h>
#include <string.h>

General* new_general() {
	General* r = calloc(1, sizeof(General));
	r->audioFilename = calloc(1, sizeof(char));
	r->audioLeadIn = 0;
	r->audioHash = calloc(1, sizeof(char));
	r->previewTime = -1;
	r->countdown = 1;
	r->sampleSet = calloc(6, sizeof(char));
	strcpy(r->sampleSet, "Normal");
	r->sampleSet[6] = '\0';
	r->skinPreference = calloc(1, sizeof(char));
	r->stackLeniency = 0.7;
	r->mode = 0;
	r->letterboxInBreaks = 0;
	r->storyFireInFront = 1;
	r->useSkinSprites = 0;
	r->alwaysShowPlayfield = 0;
	r->overlayPosition = calloc(8, sizeof(char) + 1);
	strcpy(r->overlayPosition, "NoChange");
	r->overlayPosition[8] = '\0';
	r->skinPreference = calloc(1, sizeof(char));
	r->epilepsyWarning = 0;
	r->countdownOffset = 0;
	r->specialStyle = 0;
	r->widescreenStoryboard = 0;
	r->samplesMatchPlaybackRate = 0;
	return r;
}

Editor* new_editor() {
	Editor* r = calloc(1, sizeof(Editor));
	r->bookmarks = new_ilist(0);
	r->distanceSpacing = 0.0;
	r->beatDivisor = 0;
	r->gridSize = 0;
	r->timelineZoom = 0.0;
	return r;
}

Metadata* new_metadata() {
	Metadata* r = calloc(1, sizeof(Metadata));
	r->title = calloc(1, sizeof(char));
	r->titleUnicode = calloc(1, sizeof(char));
	r->artist = calloc(1, sizeof(char));
	r->artistUnicode = calloc(1, sizeof(char));
	r->creator = calloc(1, sizeof(char));
	r->version = calloc(1, sizeof(char));
	r->source = calloc(1, sizeof(char));
	r->tags = new_slist(0);
	r->beatmapId = 0;
	r->beatmapSetId = 0;
	return r;
}

Difficulty* new_difficulty() {
	Difficulty* r = calloc(1, sizeof(Difficulty));
	r->hpDrainRate = 5.0;
	r->circleSize = 5.0;
	r->overallDifficulty = 5.0;
	r->approachRate = 5.0;
	r->sliderMultiplier = 0.0;
	r->sliderTickRate = 0.0;
	return r;
}

BackgroundEvent* new_backgroundEvent() {
	BackgroundEvent* r = calloc(1, sizeof(BackgroundEvent));
	r->filename = calloc(1, 1);
	r->xOffset = 0;
	r->yOffset = 0;
	return r;
}

VideoEvent* new_videoEvent() {
	VideoEvent* r = calloc(1, sizeof(VideoEvent));
	r->filename = calloc(1, 1);
	r->xOffset = 0;
	r->yOffset = 0;
	return r;
}

BreakEvent* new_breakEvent() {
	BreakEvent* r = calloc(1, sizeof(BreakEvent));
	r->endTime = 0;
	return r;
}

Event* new_event() {
	Event* r = calloc(1, sizeof(Event));
	r->type = 0;
	r->startTime = 0;
	r->event = NULL;
	return r;
}

TimingPoint* new_timingPoint() {
	TimingPoint* r = calloc(1, sizeof(TimingPoint));
	r->time = 0;
	r->beatLength = 0.0;
	r->meter = 0;
	r->sampleSet = 0;
	r->sampleIndex = 0;
	r->volume = 0;
	r->uninherited = 0;
	r->effects = 0;
	return r;
}

BeatmapComboColour* new_beatmapComboColour() {
	BeatmapComboColour* r = calloc(1, sizeof(BeatmapComboColour));
	r->combo = 0;
	return r;
}

BeatmapColour* new_beatmapColour() {
	BeatmapColour* r = calloc(1, sizeof(BeatmapColour));
	r->type = 0;
	r->red = 0;
	r->green = 0;
	r->blue = 0;
	r->object = NULL;
	return r;
}

HitSound* new_hitSound() {
	HitSound* r = calloc(1, sizeof(HitSound));
	r->normal = 1;
	r->whistle = 0;
	r->finish = 0;
	r->clap = 0;
	return r;
}

HitSample* new_hitSample() {
	HitSample* r = calloc(1, sizeof(HitSample));
	r->normalSet = 0;
	r->additionSet = 0;
	r->index = 0;
	r->volume = 0;
	r->filename = calloc(1, 1);
	return r;
}

CurvePoint* new_curvePoint() {
	CurvePoint* r = calloc(1, sizeof(CurvePoint));
	r->x = 0;
	r->y = 0;
	return r;
}

EdgeSet* new_edgeSet() {
	EdgeSet* r = calloc(1, sizeof(EdgeSet));
	r->normalSet = NULL;
	r->additionSet = NULL;
	return r;
}

Slider* new_slider() {
	Slider* r = calloc(1, sizeof(Slider));
	r->curveType = 0;
	r->curvePoints = new_list(0);
	r->slides = 0;
	r->length = 0.0;
	r->edgeSounds = new_ilist(0);
	r->edgeSets = new_list(0);
	return r;
}

Spinner* new_spinner() {
	Spinner* r = calloc(1, sizeof(Spinner));
	r->endTime = 0;
	return r;
}

Hold* new_hold() {
	Hold* r = calloc(1, sizeof(Hold));
	r->endTime = 0;
	return r;
}

HitObject* new_hitObject() {
	HitObject* r = calloc(1, sizeof(HitObject));
	r->x = 0;
	r->y = 0;
	r->time = 0;
	r->type = 0;
	r->new_combo = 0;
	r->combo_skip = 0;
	r->hitSound = new_hitSound();
	r->object = NULL;
	r->hitSample = new_hitSample();
	return r;
}

Beatmap* new_beatmap() {
	Beatmap* r = calloc(1, sizeof(Beatmap));
	r->general = new_general();
	r->editor = new_editor();
	r->metadata = new_metadata();
	r->difficulty = new_difficulty();
	r->events = new_list(0);
	r->timingPoints = new_list(0);
	r->beatmapColours = new_list(0);
	r->hitObjects = new_list(0);
	return r;
}

void free_general(General* general) {
	free(general->audioFilename);
	free(general->audioHash);
	free(general->sampleSet);
	free(general->overlayPosition);
	free(general->skinPreference);
	free(general);
}

void free_editor(Editor* editor) {
	free_ilist(editor->bookmarks);
	free(editor);
}

void free_metadata(Metadata* metadata) {
	free(metadata->title);
	free(metadata->titleUnicode);
	free(metadata->artist);
	free(metadata->artistUnicode);
	free(metadata->creator);
	free(metadata->version);
	free(metadata->source);
	free_slist(metadata->tags);
	free(metadata);
}

void free_difficulty(Difficulty* difficulty) {
	free(difficulty);
}

void free_backgroundEvent(BackgroundEvent* backgroundEvent) {
	free(backgroundEvent->filename);
	free(backgroundEvent);
}

void free_videoEvent(VideoEvent* videoEvent) {
	free(videoEvent->filename);
	free(videoEvent);
}

void free_event(Event* event) {
	if (event->event != NULL) {
		if (event->type == 0)
			free_backgroundEvent((BackgroundEvent*)event->event);
		else if (event->type == 1)
			free_videoEvent((VideoEvent*)event->event);
		else
			free(event->event);
	}
	free(event);
}

void free_timingPoint(TimingPoint* timingPoint) {
	free(timingPoint);
}

void free_beatmapColour(BeatmapColour* beatmapColour) {
	if (beatmapColour->object != NULL) {
		if (beatmapColour->type == 0)
			free(beatmapColour->object);
	}
	free(beatmapColour);
}

void free_hitSample(HitSample* hitSample) {
	free(hitSample->filename);
	free(hitSample);
}

void free_slider(Slider* slider) {
	free_list(slider->curvePoints);
	free_ilist(slider->edgeSounds);
	free_list(slider->edgeSets);
	free(slider);
}

void free_hitObject(HitObject* hitObject) {
	if (hitObject->object != NULL) {
		if (hitObject->type == 1)
			free_slider((Slider*)hitObject->object);
		else if (hitObject->type != 0)
			free(hitObject->object);
	}
	if (hitObject->hitSound != NULL)
		free(hitObject->hitSound);
	if (hitObject->hitSample != NULL)
		free_hitSample(hitObject->hitSample);
	free(hitObject);
}

void free_beatmap(Beatmap* beatmap) {
	free_general(beatmap->general);
	free_editor(beatmap->editor);
	free_metadata(beatmap->metadata);
	free_difficulty(beatmap->difficulty);
	size_t i = 0;
	while (i < beatmap->events->size)
		free_event(beatmap->events->elements[i++]);
	free(beatmap->events);
	i = 0;
	while (i < beatmap->timingPoints->size)
		free_timingPoint(beatmap->timingPoints->elements[i++]);
	free(beatmap->timingPoints);
	i = 0;
	while (i < beatmap->beatmapColours->size)
		free_beatmapColour(beatmap->beatmapColours->elements[i++]);
	free(beatmap->beatmapColours);
	i = 0;
	while (i < beatmap->hitObjects->size)
		free_hitObject(beatmap->hitObjects->elements[i++]);
	free(beatmap->hitObjects);
	free(beatmap);
}
