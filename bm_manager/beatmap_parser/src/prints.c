#include "prints.h"

void print_general(const General* general) {
	printf("General:\n\n");
	printf("Audio Filename: %s\n", general->audioFilename);
	printf("Audio Lead-In: %d\n", general->audioLeadIn);
	printf("Audio Hash: %s\n", general->audioHash);
	printf("Preview Time: %d\n", general->previewTime);
	printf("Countdown: %d\n", general->countdown);
	printf("Sample Set: %s\n", general->sampleSet);
	printf("Stack Leniency: %f\n", general->stackLeniency);
	printf("Mode: %d\n", general->mode);
	printf("Letterbox In Breaks: %d\n", general->letterboxInBreaks);
	printf("Story Fire In Front: %d\n", general->storyFireInFront);
	printf("Use Skin Sprites: %d\n", general->useSkinSprites);
	printf("Always Show Playfield: %d\n", general->alwaysShowPlayfield);
	printf("Overlay Position: %s\n", general->overlayPosition);
	printf("Skin Preference: %s\n", general->skinPreference);
	printf("Epilepsy Warning: %d\n", general->epilepsyWarning);
	printf("Countdown Offset: %d\n", general->countdownOffset);
	printf("Special Style: %d\n", general->specialStyle);
	printf("Widescreen Storyboard: %d\n", general->widescreenStoryboard);
	printf("Samples Match Playback Rate: %d\n\n", general->samplesMatchPlaybackRate);
}

void print_editor(const Editor* editor) {
	printf("Editor:\n\n");
	printf("Bookmarks: ");
	if (editor->bookmarks == NULL)
		printf("NULL\n");
	else
		print_ilist(editor->bookmarks);
	printf("Distance Spacing: %0.2f\n", editor->distanceSpacing);
	printf("Beat Divisor: %d\n", editor->beatDivisor);
	printf("Grid Size: %d\n", editor->gridSize);
	printf("Timeline Zoom: %0.2f\n\n", editor->timelineZoom);
}

void print_metadata(const Metadata* metadata) {
	printf("Metadata:\n\n");
	printf("Title: %s\n", metadata->title);
	printf("Title (Unicode): %s\n", metadata->titleUnicode);
	printf("Artist: %s\n", metadata->artist);
	printf("Artist (Unicode): %s\n", metadata->artistUnicode);
	printf("Creator: %s\n", metadata->creator);
	printf("Version: %s\n", metadata->version);
	printf("Source: %s\n", metadata->source);
	printf("Tags: ");
	if (metadata->tags == NULL)
		printf("NULL\n");
	else
		print_slist(metadata->tags, 0);
	printf("Beatmap ID: %d\n", metadata->beatmapID);
	printf("Beatmap Set ID: %d\n\n", metadata->beatmapSetID);
}

void print_difficulty(const Difficulty* difficulty) {
	printf("Difficulty:\n\n");
	printf("HP Drain Rate: %.2f\n", difficulty->hpDrainRate);
	printf("Circle Size: %.2f\n", difficulty->circleSize);
	printf("Overall Difficulty: %.2f\n", difficulty->overallDifficulty);
	printf("Approach Rate: %.2f\n", difficulty->approachRate);
	printf("Slider Multiplier: %.2f\n", difficulty->sliderMultiplier);
	printf("Slider Tick Rate: %.2f\n\n", difficulty->sliderTickRate);
}

void print_event(const Event* event) {
	if (event == NULL) {
		printf("Invalid event.\n");
		return;
	}

	int eventType = event->type;
	int startTime = event->startTime;

	printf("Event Type: %d\n", eventType);
	printf("Start Time: %d\n", startTime);

	if (eventType == 0) {
		BackgroundEvent* backgroundEvent = (BackgroundEvent*)event->event;
		printf("Filename: %s\n", backgroundEvent->filename);
		printf("xOffset: %d\n", backgroundEvent->xOffset);
		printf("yOffset: %d\n", backgroundEvent->yOffset);
	} else if (eventType == 1) {
		VideoEvent* videoEvent = (VideoEvent*)event->event;
		printf("Filename: %s\n", videoEvent->filename);
		printf("xOffset: %d\n", videoEvent->xOffset);
		printf("yOffset: %d\n", videoEvent->yOffset);
	} else if (eventType == 2) {
		BreakEvent* breakEvent = (BreakEvent*)event->event;
		printf("End Time: %d\n", breakEvent->endTime);
	} else {
		printf("Unknown event type.\n");
	}
}

void print_events(const List* events) {
	if (events == NULL || events->elements == NULL) {
		printf("Invalid Event list.\n");
		return;
	}
	size_t size = events->size;
	printf("Events (%zu):\n\n", size);
	for (size_t i = 0; i < size; i++) {
		Event* event = (Event*)events->elements[i];
		printf("(%zu)\n", i);
		print_event(event);
		printf("\n");
	}
	printf("\n");
}

void print_timingPoint(const TimingPoint* timingPoint) {
	printf("Time: %d\n", timingPoint->time);
	printf("Beat Length: %f\n", timingPoint->beatLength);
	printf("Meter: %d\n", timingPoint->meter);
	printf("Sample Set: %d\n", timingPoint->sampleSet);
	printf("Sample Index: %d\n", timingPoint->sampleIndex);
	printf("Volume: %d\n", timingPoint->volume);
	printf("Uninherited: %d\n", timingPoint->uninherited);
	printf("Effects: %d\n", timingPoint->effects);
}

void print_timingPoints(const List* timingPoints) {
	if (timingPoints == NULL || timingPoints->elements == NULL) {
		printf("Invalid TimingPoint list.\n");
		return;
	}
	size_t size = timingPoints->size;
	printf("TimingPoints (%zu):\n\n", size);
	for (size_t i = 0; i < size; i++) {
		TimingPoint* timingPoint = (TimingPoint*)timingPoints->elements[i];
		printf("(%zu)\n", i);
		print_timingPoint(timingPoint);
		printf("\n");
	}
	printf("\n");
}

void print_beatmapColour(const BeatmapColour* beatmapColour) {
	printf("Type: %d\n", beatmapColour->type);
	printf("Red: %d\n", beatmapColour->red);
	printf("Green: %d\n", beatmapColour->green);
	printf("Blue: %d\n", beatmapColour->blue);
	if (beatmapColour->type == 0) printf("Combo: %d\n", ((BeatmapComboColour*)beatmapColour->object)->combo);
}

void print_beatmapColours(const List* beatmapColours) {
	if (beatmapColours == NULL || beatmapColours->elements == NULL) {
		printf("Invalid BeatmapColour list.\n");
		return;
	}
	size_t size = beatmapColours->size;
	printf("BeatmapColours (%zu):\n\n", size);
	for (size_t i = 0; i < size; i++) {
		BeatmapColour* beatmapColour = (BeatmapColour*)beatmapColours->elements[i];
		printf("(%zu)\n", i);
		print_beatmapColour(beatmapColour);
		printf("\n");
	}
	printf("\n");
}

void print_hitSound(const HitSound* hitSound) {
	printf("\tNormal: %d\n", hitSound->normal);
	printf("\tWhistle: %d\n", hitSound->whistle);
	printf("\tFinish: %d\n", hitSound->finish);
	printf("\tClap: %d\n", hitSound->clap);
}

void print_hitSample(const HitSample* hitSample) {
	printf("\tNormalSet: %d\n", hitSample->normalSet);
	printf("\tAdditionSet: %d\n", hitSample->additionSet);
	printf("\tIndex: %d\n", hitSample->index);
	printf("\tVolume: %d\n", hitSample->volume);
	printf("\tFilename: %s\n", hitSample->filename);
}

void print_slider(const Slider* slider) {
	printf("Slider:\n");
	printf("\tCurveType: %c\n", slider->curveType);
	printf("\tCurvePoints: [");
	for (size_t i = 0; i < slider->curvePoints->size; i++) {
		CurvePoint* curvePoint = (CurvePoint*)slider->curvePoints->elements[i];
		printf("(%d, %d)", curvePoint->x, curvePoint->y);
		if (i < slider->curvePoints->size - 1) {
			printf(", ");
		}
	}
	printf("]\n");
	printf("\tSlides: %d\n", slider->slides);
	printf("\tLength: %.2f\n", slider->length);
	printf("\tEdgeSounds: ");
	if (slider->edgeSounds == NULL)
		printf("NULL\n");
	else
		print_ilist(slider->edgeSounds);
	printf("\tEdgeSets: [");
	for (size_t i = 0; i < slider->edgeSets->size; i++) {
		EdgeSet* edgeSet = (EdgeSet*)slider->edgeSets->elements[i];
		printf("(%s, %s)", edgeSet->normalSet, edgeSet->additionSet);
		if (i < slider->edgeSets->size - 1) {
			printf(", ");
		}
	}
	printf("]\n");
}

void print_spinner(const Spinner* spinner) {
	printf("Spinner:\n");
	printf("\tEndTime: %d\n", spinner->endTime);
}

void print_hold(const Hold* hold) {
	printf("Hold:\n");
	printf("\tEndTime: %d\n", hold->endTime);
}

void print_hitObject(const HitObject* hitObject) {
	printf("X: %d\n", hitObject->x);
	printf("Y: %d\n", hitObject->y);
	printf("Time: %d\n", hitObject->time);
	printf("Type: %d\n", hitObject->type);
	printf("NewCombo: %d\n", hitObject->new_combo);
	printf("ComboSkip: %d\n", hitObject->combo_skip);
	printf("HitSound:\n");
	if (hitObject->hitSound != NULL) print_hitSound(hitObject->hitSound);
	else {
		printf("wtf\n");
		exit(1);
	}
	printf("Object: ");
	if (hitObject->type == 0) {
		printf("HitCircle:\n");
	} else if (hitObject->type == 1) {
		Slider* slider = (Slider*)hitObject->object;
		print_slider(slider);
	} else if (hitObject->type == 2) {
		Spinner* spinner = (Spinner*)hitObject->object;
		print_spinner(spinner);
	} else if (hitObject->type == 3) {
		Hold* hold = (Hold*)hitObject->object;
		print_hold(hold);
	}
	printf("HitSample:\n");
	print_hitSample(hitObject->hitSample);
}

void print_hitObjects(const List* hitObjects) {
	if (hitObjects == NULL || hitObjects->elements == NULL) {
		printf("Invalid HitObject list.\n");
		return;
	}
	size_t size = hitObjects->size;
	printf("HitObjects (%zu):\n\n", size);
	for (size_t i = 0; i < size; i++) {
		HitObject* hitObject = (HitObject*)hitObjects->elements[i];
		printf("(%zu)\n", i);
		print_hitObject(hitObject);
		printf("\n");
	}
	printf("\n");
}

void print_beatmap(Beatmap* beatmap) {
	print_general(beatmap->general);
	print_editor(beatmap->editor);
	print_metadata(beatmap->metadata);
	print_difficulty(beatmap->difficulty);
	print_events(beatmap->events);
	print_timingPoints(beatmap->timingPoints);
	print_beatmapColours(beatmap->beatmapColours);
	print_hitObjects(beatmap->hitObjects);
}
