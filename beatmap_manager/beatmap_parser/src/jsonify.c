#include "../../c_utils/src/debug.h"
#include "structs.h"

void jsonify_general_pretty(const General* general, FILE* fp) {
	fprintf(fp, "\t\"General\":\n");
	fprintf(fp, "\t{\n");
	fprintf(fp, "\t\t\"AudioFilename\": \"%s\",\n", general->audioFilename);
	fprintf(fp, "\t\t\"AudioLead-In\": %d,\n", general->audioLeadIn);
	fprintf(fp, "\t\t\"AudioHash\": \"%s\",\n", general->audioHash);
	fprintf(fp, "\t\t\"PreviewTime\": %d,\n", general->previewTime);
	fprintf(fp, "\t\t\"Countdown\": %d,\n", general->countdown);
	fprintf(fp, "\t\t\"SampleSet\": \"%s\",\n", general->sampleSet);
	fprintf(fp, "\t\t\"StackLeniency\": %.1f,\n", general->stackLeniency);
	fprintf(fp, "\t\t\"Mode\": %d,\n", general->mode);
	fprintf(fp, "\t\t\"LetterboxInBreaks\": %d,\n", general->letterboxInBreaks);
	fprintf(fp, "\t\t\"StoryFireInFront\": %d,\n", general->storyFireInFront);
	fprintf(fp, "\t\t\"UseSkinSprites\": %d,\n", general->useSkinSprites);
	fprintf(fp, "\t\t\"AlwaysShowPlayfield\": %d,\n",
			general->alwaysShowPlayfield);
	fprintf(fp, "\t\t\"OverlayPosition\": \"%s\",\n", general->overlayPosition);
	fprintf(fp, "\t\t\"SkinPreference\": \"%s\",\n", general->skinPreference);
	fprintf(fp, "\t\t\"EpilepsyWarning\": %d,\n", general->epilepsyWarning);
	fprintf(fp, "\t\t\"CountdownOffset\": %d,\n", general->countdownOffset);
	fprintf(fp, "\t\t\"SpecialStyle\": %d,\n", general->specialStyle);
	fprintf(fp, "\t\t\"WidescreenStoryboard\": %d,\n",
			general->widescreenStoryboard);
	fprintf(fp, "\t\t\"SamplesMatchPlaybackRate\": %d\n",
			general->samplesMatchPlaybackRate);
	fprintf(fp, "\t},\n");
}

void jsonify_editor_pretty(const Editor* editor, FILE* fp) {
	fprintf(fp, "\t\"Editor\":\n");
	fprintf(fp, "\t{\n");
	fprintf(fp, "\t\t\"Bookmarks\": ");
	if (editor->bookmarks == NULL)
		fprintf(fp, "null,\n");
	else {
		fprintf_ilist(editor->bookmarks, fp);
		fprintf(fp, ",\n");
	}
	fprintf(fp, "\t\t\"DistanceSpacing\": %0.2f,\n", editor->distanceSpacing);
	fprintf(fp, "\t\t\"BeatDivisor\": %d,\n", editor->beatDivisor);
	fprintf(fp, "\t\t\"GridSize\": %d,\n", editor->gridSize);
	fprintf(fp, "\t\t\"TimelineZoom\": %0.2f\n", editor->timelineZoom);
	fprintf(fp, "\t},\n");
}

void jsonify_metadata_pretty(const Metadata* metadata, FILE* fp) {
	fprintf(fp, "\t\"Metadata\":\n");
	fprintf(fp, "\t{\n");
	fprintf(fp, "\t\t\"Title\": \"%s\",\n", metadata->title);
	fprintf(fp, "\t\t\"TitleUnicode\": \"%s\",\n", metadata->titleUnicode);
	fprintf(fp, "\t\t\"Artist\": \"%s\",\n", metadata->artist);
	fprintf(fp, "\t\t\"ArtistUnicode\": \"%s\",\n", metadata->artist);
	fprintf(fp, "\t\t\"Creator\": \"%s\",\n", metadata->creator);
	fprintf(fp, "\t\t\"Version\": \"%s\",\n", metadata->version);
	fprintf(fp, "\t\t\"Source\": \"%s\",\n", metadata->source);
	fprintf(fp, "\t\t\"Tags\": ");
	if (metadata->tags == NULL)
		fprintf(fp, "null,\n");
	else {
		fprintf_slist(metadata->tags, fp, 2);
		fprintf(fp, ",\n");
	}
	fprintf(fp, "\t\t\"BeatmapID\": %d,\n", metadata->beatmapID);
	fprintf(fp, "\t\t\"BeatmapSetID\": %d\n", metadata->beatmapSetID);
	fprintf(fp, "\t},\n");
}

void jsonify_difficulty_pretty(const Difficulty* difficulty, FILE* fp) {
	fprintf(fp, "\t\"Difficulty\":\n");
	fprintf(fp, "\t{\n");
	fprintf(fp, "\t\t\"HPDrainRate\": %.2f,\n", difficulty->hpDrainRate);
	fprintf(fp, "\t\t\"CircleSize\": %.2f,\n", difficulty->circleSize);
	fprintf(fp, "\t\t\"OverallDifficulty\": %.2f,\n",
			difficulty->overallDifficulty);
	fprintf(fp, "\t\t\"ApproachRate\": %.2f,\n", difficulty->approachRate);
	fprintf(fp, "\t\t\"SliderMultiplier\": %.2f,\n",
			difficulty->sliderMultiplier);
	fprintf(fp, "\t\t\"SliderTickRate\": %.2f\n", difficulty->sliderTickRate);
	fprintf(fp, "\t},\n");
}

#define jsonify_event_pretty                                                   \
	fprintf(fp, "\t\t{\n");                                                    \
	int eventType = event->type;                                               \
	fprintf(fp, "\t\t\t\"EventType\": %d,\n", eventType);                      \
	fprintf(fp, "\t\t\t\"StartTime\": %d,\n", event->startTime);               \
	if (eventType == 0) {                                                      \
		BackgroundEvent* backgroundEvent = (BackgroundEvent*)event->event;     \
		fprintf(fp, "\t\t\t\"Filename\": \"%s\",\n",                           \
				backgroundEvent->filename);                                    \
		fprintf(fp, "\t\t\t\"xOffset\": %d,\n", backgroundEvent->xOffset);     \
		fprintf(fp, "\t\t\t\"yOffset\": %d\n", backgroundEvent->yOffset);      \
	} else if (eventType == 1) {                                               \
		VideoEvent* videoEvent = (VideoEvent*)event->event;                    \
		fprintf(fp, "\t\t\t\"Filename\": \"%s\",\n", videoEvent->filename);    \
		fprintf(fp, "\t\t\t\"xOffset\": %d,\n", videoEvent->xOffset);          \
		fprintf(fp, "\t\t\t\"yOffset\": %d\n", videoEvent->yOffset);           \
	} else {                                                                   \
		BreakEvent* breakEvent = (BreakEvent*)event->event;                    \
		fprintf(fp, "\t\t\t\"EndTime\": %d\n", breakEvent->endTime);           \
	}

void jsonify_events_pretty(const List* events, FILE* fp) {
	fprintf(fp, "\t\"Events\":\n");
	fprintf(fp, "\t[\n");
	Event* event = NULL;
	for (size_t i = 0; i < events->size - 1; i++) {
		event = events->elements[i];
		jsonify_event_pretty fprintf(fp, "\t\t},\n");
	}
	if (events->size > 0) {
		event = events->elements[events->size - 1];
		jsonify_event_pretty fprintf(fp, "\t\t}\n");
	}
	fprintf(fp, "\t],\n");
}

#define jsonify_timingPoint_pretty                                             \
	fprintf(fp, "\t\t{\n");                                                    \
	fprintf(fp, "\t\t\t\"Time\": %d,\n", timingPoint->time);                   \
	fprintf(fp, "\t\t\t\"BeatLength\": %.12f,\n", timingPoint->beatLength);    \
	fprintf(fp, "\t\t\t\"Meter\": %d,\n", timingPoint->meter);                 \
	fprintf(fp, "\t\t\t\"SampleSet\": %d,\n", timingPoint->sampleSet);         \
	fprintf(fp, "\t\t\t\"SampleIndex\": %d,\n", timingPoint->sampleIndex);     \
	fprintf(fp, "\t\t\t\"Volume\": %d,\n", timingPoint->volume);               \
	fprintf(fp, "\t\t\t\"Uninherited\": %d,\n", timingPoint->uninherited);     \
	fprintf(fp, "\t\t\t\"Effects\": %d\n", timingPoint->effects);

void jsonify_timingPoints_pretty(const List* timingPoints, FILE* fp) {
	fprintf(fp, "\t\"TimingPoints\":\n");
	fprintf(fp, "\t[\n");
	TimingPoint* timingPoint = NULL;
	for (size_t i = 0; i < timingPoints->size - 1; i++) {
		timingPoint = timingPoints->elements[i];
		jsonify_timingPoint_pretty fprintf(fp, "\t\t},\n");
	}
	if (timingPoints->size > 0) {
		timingPoint = timingPoints->elements[timingPoints->size - 1];
		jsonify_timingPoint_pretty fprintf(fp, "\t\t}\n");
	}
	fprintf(fp, "\t],\n");
}

#define jsonify_beatmapColour_pretty                                           \
	fprintf(fp, "\t\t{\n");                                                    \
	fprintf(fp, "\t\t\t\"Type\": %d,\n", beatmapColour->type);                 \
	fprintf(fp, "\t\t\t\"Red\": %d,\n", beatmapColour->red);                   \
	fprintf(fp, "\t\t\t\"Green\": %d,\n", beatmapColour->green);               \
	if (beatmapColour->type == 0) {                                            \
		fprintf(fp, "\t\t\t\"Blue\": %d,\n", beatmapColour->blue);             \
		fprintf(fp, "\t\t\t\"Combo\": %d\n",                                   \
				((BeatmapComboColour*)beatmapColour->object)->combo);          \
	} else {                                                                   \
		fprintf(fp, "\t\t\t\"Blue\": %d\n", beatmapColour->blue);              \
	}

void jsonify_beatmapColours_pretty(const List* beatmapColours, FILE* fp) {
	fprintf(fp, "\t\"BeatmapColours\":\n");
	fprintf(fp, "\t[\n");
	BeatmapColour* beatmapColour = NULL;
	for (size_t i = 0; i < beatmapColours->size - 1; i++) {
		beatmapColour = beatmapColours->elements[i];
		jsonify_beatmapColour_pretty fprintf(fp, "\t\t},\n");
	}
	if (beatmapColours->size > 0) {
		beatmapColour = beatmapColours->elements[beatmapColours->size - 1];
		jsonify_beatmapColour_pretty;
		fprintf(fp, "\t\t}\n");
	}
	fprintf(fp, "\t],\n");
}

void jsonify_slider_pretty(const Slider* slider, FILE* fp) {
	fprintf(fp, "\n\t\t\t{\n");
	fprintf(fp, "\t\t\t\t\"CurveType\": \"%c\",\n", slider->curveType);
	fprintf(fp, "\t\t\t\t\"CurvePoints\": ");
	if (slider->curvePoints) {
		fprintf(fp, "[");
		if (slider->curvePoints->size > 0) {
			for (size_t i = 0; i < slider->curvePoints->size - 1; i++) {
				CurvePoint* curvePoint =
					(CurvePoint*)slider->curvePoints->elements[i];
				fprintf(fp, "[%d, %d], ", curvePoint->x, curvePoint->y);
			}
			CurvePoint* lastCurvePoint =
				(CurvePoint*)slider->curvePoints
					->elements[slider->curvePoints->size - 1];
			fprintf(fp, "[%d, %d]", lastCurvePoint->x, lastCurvePoint->y);
		}
		fprintf(fp, "],\n");
	} else
		fprintf(fp, "null,\n");
	fprintf(fp, "\t\t\t\t\"Slides\": %d,\n", slider->slides);
	fprintf(fp, "\t\t\t\t\"Length\": %.2f,\n", slider->length);
	fprintf(fp, "\t\t\t\t\"EdgeSounds\": ");
	if (slider->edgeSounds) {
		fprintf_ilist(slider->edgeSounds, fp);
		fprintf(fp, ",\n");
	} else
		fprintf(fp, "null,\n");
	fprintf(fp, "\t\t\t\t\"EdgeSets\": ");
	if (slider->edgeSets) {
		fprintf(fp, "[");
		if (slider->edgeSets->size > 0) {
			for (size_t i = 0; i < slider->edgeSets->size - 1; i++) {
				EdgeSet* edgeSet = (EdgeSet*)slider->edgeSets->elements[i];
				fprintf(fp, "[%s, %s], ", edgeSet->normalSet,
						edgeSet->additionSet);
			}
			EdgeSet* lastEdgeSet =
				(EdgeSet*)
					slider->edgeSets->elements[slider->edgeSets->size - 1];
			fprintf(fp, "[%s, %s]", lastEdgeSet->normalSet,
					lastEdgeSet->additionSet);
		}
		fprintf(fp, "]\n");
	} else
		fprintf(fp, "null,\n");
	fprintf(fp, "\t\t\t},\n");
}

void jsonify_spinner_pretty(const Spinner* spinner, FILE* fp) {
	fprintf(fp, "\n\t\t\t{\n");
	fprintf(fp, "\t\t\t\t\"EndTime\": %d\n", spinner->endTime);
	fprintf(fp, "\t\t\t},\n");
}

void jsonify_hold_pretty(const Hold* hold, FILE* fp) {
	fprintf(fp, "\n\t\t\t{\n");
	fprintf(fp, "\t\t\t\t\"EndTime\": %d\n", hold->endTime);
	fprintf(fp, "\t\t\t},\n");
}

#define jsonify_hitObject_pretty                                               \
	fprintf(fp, "\t\t{\n");                                                    \
	fprintf(fp, "\t\t\t\"X\": %d,\n", hitObject->x);                           \
	fprintf(fp, "\t\t\t\"Y\": %d,\n", hitObject->y);                           \
	fprintf(fp, "\t\t\t\"Time\": %d,\n", hitObject->time);                     \
	fprintf(fp, "\t\t\t\"Type\": %d,\n", hitObject->type);                     \
	fprintf(fp, "\t\t\t\"NewCombo\": %d,\n", hitObject->new_combo);            \
	fprintf(fp, "\t\t\t\"ComboSkip\": %d,\n", hitObject->combo_skip);          \
	HitSound* hitSound = hitObject->hitSound;                                  \
	fprintf(fp, "\t\t\t\"HitSound\": [%d, %d, %d, %d],\n", hitSound->normal,   \
			hitSound->whistle, hitSound->finish, hitSound->clap);              \
	fprintf(fp, "\t\t\t\"Object\":");                                          \
	if (hitObject->type == 0)                                                  \
		fprintf(fp, "null,\n");                                                \
	else if (hitObject->type == 1)                                             \
		jsonify_slider_pretty(hitObject->object, fp);                          \
	else if (hitObject->type == 2)                                             \
		jsonify_spinner_pretty(hitObject->object, fp);                         \
	else if (hitObject->type == 3)                                             \
		jsonify_hold_pretty(hitObject->object, fp);                            \
	HitSample* hitSample = hitObject->hitSample;                               \
	fprintf(fp, "\t\t\t\"HitSample\": [%d, %d, %d, %d, \"%s\"]\n",             \
			hitSample->normalSet, hitSample->additionSet, hitSample->index,    \
			hitSample->volume, hitSample->filename);

void jsonify_hitObjects_pretty(const List* hitObjects, FILE* fp) {
	fprintf(fp, "\t\"HitObjects\":\n");
	fprintf(fp, "\t[\n");
	HitObject* hitObject = NULL;
	for (size_t i = 0; i < hitObjects->size - 1; i++) {
		hitObject = hitObjects->elements[i];
		jsonify_hitObject_pretty fprintf(fp, "\t\t},\n");
	}
	if (hitObjects->size > 0) {
		hitObject = hitObjects->elements[hitObjects->size - 1];
		jsonify_hitObject_pretty fprintf(fp, "\t\t}\n");
	}
	fprintf(fp, "\t]\n");
}

void jsonify_beatmap_to_file_pretty(Beatmap* beatmap, FILE* fp) {
	fprintf(fp, "{\n");
	jsonify_general_pretty(beatmap->general, fp);
	jsonify_editor_pretty(beatmap->editor, fp);
	jsonify_metadata_pretty(beatmap->metadata, fp);
	jsonify_difficulty_pretty(beatmap->difficulty, fp);
	jsonify_events_pretty(beatmap->events, fp);
	jsonify_timingPoints_pretty(beatmap->timingPoints, fp);
	jsonify_beatmapColours_pretty(beatmap->beatmapColours, fp);
	jsonify_hitObjects_pretty(beatmap->hitObjects, fp);
	fprintf(fp, "}\n");
}

void jsonify_beatmap_pretty(Beatmap* beatmap, char* path) {
	FILE* fp = fopen(path, "w+");
	if (fp == NULL) {
		ereport("fopen failed");
		return;
	}
	jsonify_beatmap_to_file_pretty(beatmap, fp);
	fclose(fp);
}

void jsonify_general(const General* general, FILE* fp) {
	fprintf(fp, "\"a\":");
	fprintf(fp, "{");
	fprintf(fp, "\"a\":\"%s\",", general->audioFilename);
	fprintf(fp, "\"b\":%d,", general->audioLeadIn);
	fprintf(fp, "\"c\":\"%s\",", general->audioHash);
	fprintf(fp, "\"d\":%d,", general->previewTime);
	fprintf(fp, "\"e\":%d,", general->countdown);
	fprintf(fp, "\"f\":\"%s\",", general->sampleSet);
	fprintf(fp, "\"g\":%.1f,", general->stackLeniency);
	fprintf(fp, "\"h\":%d,", general->mode);
	fprintf(fp, "\"i\":%d,", general->letterboxInBreaks);
	fprintf(fp, "\"j\":%d,", general->storyFireInFront);
	fprintf(fp, "\"k\":%d,", general->useSkinSprites);
	fprintf(fp, "\"l\":%d,", general->alwaysShowPlayfield);
	fprintf(fp, "\"m\":\"%s\",", general->overlayPosition);
	fprintf(fp, "\"n\":\"%s\",", general->skinPreference);
	fprintf(fp, "\"o\":%d,", general->epilepsyWarning);
	fprintf(fp, "\"p\":%d,", general->countdownOffset);
	fprintf(fp, "\"q\":%d,", general->specialStyle);
	fprintf(fp, "\"r\":%d,", general->widescreenStoryboard);
	fprintf(fp, "\"s\":%d", general->samplesMatchPlaybackRate);
	fprintf(fp, "},");
}

void jsonify_editor(const Editor* editor, FILE* fp) {
	fprintf(fp, "\"b\":");
	fprintf(fp, "{");
	fprintf(fp, "\"a\":");
	if (editor->bookmarks == NULL)
		fprintf(fp, "null,");
	else {
		fprintf_ilist_no_spaces(editor->bookmarks, fp);
		fprintf(fp, ",");
	}
	fprintf(fp, "\"b\":%0.2f,", editor->distanceSpacing);
	fprintf(fp, "\"c\":%d,", editor->beatDivisor);
	fprintf(fp, "\"d\":%d,", editor->gridSize);
	fprintf(fp, "\"e\":%0.2f", editor->timelineZoom);
	fprintf(fp, "},");
}

void jsonify_metadata(const Metadata* metadata, FILE* fp) {
	fprintf(fp, "\"c\":");
	fprintf(fp, "{");
	fprintf(fp, "\"a\":\"%s\",", metadata->title);
	fprintf(fp, "\"b\":\"%s\",", metadata->titleUnicode);
	fprintf(fp, "\"c\":\"%s\",", metadata->artist);
	fprintf(fp, "\"d\":\"%s\",", metadata->artist);
	fprintf(fp, "\"e\":\"%s\",", metadata->creator);
	fprintf(fp, "\"f\":\"%s\",", metadata->version);
	fprintf(fp, "\"g\":\"%s\",", metadata->source);
	fprintf(fp, "\"h\":");
	if (metadata->tags == NULL)
		fprintf(fp, "null,");
	else {
		fprintf_slist_no_spaces(metadata->tags, fp, 2);
		fprintf(fp, ",");
	}
	fprintf(fp, "\"i\":%d,", metadata->beatmapID);
	fprintf(fp, "\"j\":%d", metadata->beatmapSetID);
	fprintf(fp, "},");
}

void jsonify_difficulty(const Difficulty* difficulty, FILE* fp) {
	fprintf(fp, "\"d\":");
	fprintf(fp, "{");
	fprintf(fp, "\"a\":%.2f,", difficulty->hpDrainRate);
	fprintf(fp, "\"b\":%.2f,", difficulty->circleSize);
	fprintf(fp, "\"c\":%.2f,", difficulty->overallDifficulty);
	fprintf(fp, "\"d\":%.2f,", difficulty->approachRate);
	fprintf(fp, "\"e\":%.2f,", difficulty->sliderMultiplier);
	fprintf(fp, "\"f\":%.2f", difficulty->sliderTickRate);
	fprintf(fp, "},");
}

#define jsonify_event                                                          \
	fprintf(fp, "{");                                                          \
	int eventType = event->type;                                               \
	fprintf(fp, "\"a\":%d,", eventType);                                       \
	fprintf(fp, "\"b\":%d,", event->startTime);                                \
	if (eventType == 0) {                                                      \
		BackgroundEvent* backgroundEvent = (BackgroundEvent*)event->event;     \
		fprintf(fp, "\"c\":\"%s\",", backgroundEvent->filename);               \
		fprintf(fp, "\"d\":%d,", backgroundEvent->xOffset);                    \
		fprintf(fp, "\"e\":%d", backgroundEvent->yOffset);                     \
	} else if (eventType == 1) {                                               \
		VideoEvent* videoEvent = (VideoEvent*)event->event;                    \
		fprintf(fp, "\"c\":\"%s\",", videoEvent->filename);                    \
		fprintf(fp, "\"d\":%d,", videoEvent->xOffset);                         \
		fprintf(fp, "\"e\":%d", videoEvent->yOffset);                          \
	} else {                                                                   \
		BreakEvent* breakEvent = (BreakEvent*)event->event;                    \
		fprintf(fp, "\"f\":%d", breakEvent->endTime);                          \
	}

void jsonify_events(const List* events, FILE* fp) {
	fprintf(fp, "\"e\":");
	fprintf(fp, "[");
	Event* event = NULL;
	for (size_t i = 0; i < events->size - 1; i++) {
		event = events->elements[i];
		jsonify_event fprintf(fp, "},");
	}
	if (events->size > 0) {
		event = events->elements[events->size - 1];
		jsonify_event fprintf(fp, "}");
	}
	fprintf(fp, "],");
}

#define jsonify_timingPoint                                                    \
	fprintf(fp, "{");                                                          \
	fprintf(fp, "\"a\":%d,", timingPoint->time);                               \
	fprintf(fp, "\"b\":%.12f,", timingPoint->beatLength);                      \
	fprintf(fp, "\"c\":%d,", timingPoint->meter);                              \
	fprintf(fp, "\"d\":%d,", timingPoint->sampleSet);                          \
	fprintf(fp, "\"e\":%d,", timingPoint->sampleIndex);                        \
	fprintf(fp, "\"f\":%d,", timingPoint->volume);                             \
	fprintf(fp, "\"g\":%d,", timingPoint->uninherited);                        \
	fprintf(fp, "\"h\":%d", timingPoint->effects);

void jsonify_timingPoints(const List* timingPoints, FILE* fp) {
	fprintf(fp, "\"f\":");
	fprintf(fp, "[");
	TimingPoint* timingPoint = NULL;
	for (size_t i = 0; i < timingPoints->size - 1; i++) {
		timingPoint = timingPoints->elements[i];
		jsonify_timingPoint fprintf(fp, "},");
	}
	if (timingPoints->size > 0) {
		timingPoint = timingPoints->elements[timingPoints->size - 1];
		jsonify_timingPoint fprintf(fp, "}");
	}
	fprintf(fp, "],");
}

#define jsonify_beatmapColour                                                  \
	fprintf(fp, "{");                                                          \
	fprintf(fp, "\"a\":%d,", beatmapColour->type);                             \
	fprintf(fp, "\"b\":%d,", beatmapColour->red);                              \
	fprintf(fp, "\"c\":%d,", beatmapColour->green);                            \
	if (beatmapColour->type == 0) {                                            \
		fprintf(fp, "\"d\":%d,", beatmapColour->blue);                         \
		fprintf(fp, "\"e\":%d",                                                \
				((BeatmapComboColour*)beatmapColour->object)->combo);          \
	} else {                                                                   \
		fprintf(fp, "\"d\":%d", beatmapColour->blue);                          \
	}

void jsonify_beatmapColours(const List* beatmapColours, FILE* fp) {
	fprintf(fp, "\"g\":");
	fprintf(fp, "[");
	BeatmapColour* beatmapColour = NULL;
	for (size_t i = 0; i < beatmapColours->size - 1; i++) {
		beatmapColour = beatmapColours->elements[i];
		jsonify_beatmapColour fprintf(fp, "},");
	}
	if (beatmapColours->size > 0) {
		beatmapColour = beatmapColours->elements[beatmapColours->size - 1];
		jsonify_beatmapColour;
		fprintf(fp, "}");
	}
	fprintf(fp, "],");
}

void jsonify_slider(const Slider* slider, FILE* fp) {
	fprintf(fp, "{");
	fprintf(fp, "\"a\":\"%c\",", slider->curveType);
	fprintf(fp, "\"b\":");
	if (slider->curvePoints) {
		fprintf(fp, "[");
		if (slider->curvePoints->size > 0) {
			for (size_t i = 0; i < slider->curvePoints->size - 1; i++) {
				CurvePoint* curvePoint =
					(CurvePoint*)slider->curvePoints->elements[i];
				fprintf(fp, "[%d,%d],", curvePoint->x, curvePoint->y);
			}
			CurvePoint* lastCurvePoint =
				(CurvePoint*)slider->curvePoints
					->elements[slider->curvePoints->size - 1];
			fprintf(fp, "[%d,%d]", lastCurvePoint->x, lastCurvePoint->y);
		}
		fprintf(fp, "],");
	} else
		fprintf(fp, "null,");
	fprintf(fp, "\"c\":%d,", slider->slides);
	fprintf(fp, "\"d\":%.2f,", slider->length);
	fprintf(fp, "\"e\":");
	if (slider->edgeSounds) {
		fprintf_ilist_no_spaces(slider->edgeSounds, fp);
		fprintf(fp, ",");
	} else
		fprintf(fp, "null,");
	fprintf(fp, "\"f\":");
	if (slider->edgeSets) {
		fprintf(fp, "[");
		if (slider->edgeSets->size > 0) {
			for (size_t i = 0; i < slider->edgeSets->size - 1; i++) {
				EdgeSet* edgeSet = (EdgeSet*)slider->edgeSets->elements[i];
				fprintf(fp, "[%s,%s],", edgeSet->normalSet,
						edgeSet->additionSet);
			}
			EdgeSet* lastEdgeSet =
				(EdgeSet*)
					slider->edgeSets->elements[slider->edgeSets->size - 1];
			fprintf(fp, "[%s,%s]", lastEdgeSet->normalSet,
					lastEdgeSet->additionSet);
		}
		fprintf(fp, "]");
	} else
		fprintf(fp, "null,");
	fprintf(fp, "},");
}

void jsonify_spinner(const Spinner* spinner, FILE* fp) {
	fprintf(fp, "{");
	fprintf(fp, "\"a\":%d", spinner->endTime);
	fprintf(fp, "},");
}

void jsonify_hold(const Hold* hold, FILE* fp) {
	fprintf(fp, "{");
	fprintf(fp, "\"a\":%d", hold->endTime);
	fprintf(fp, "},");
}

#define jsonify_hitObject                                                      \
	fprintf(fp, "{");                                                          \
	fprintf(fp, "\"a\":%d,", hitObject->x);                                    \
	fprintf(fp, "\"b\":%d,", hitObject->y);                                    \
	fprintf(fp, "\"c\":%d,", hitObject->time);                                 \
	fprintf(fp, "\"d\":%d,", hitObject->type);                                 \
	fprintf(fp, "\"e\":%d,", hitObject->new_combo);                            \
	fprintf(fp, "\"f\":%d,", hitObject->combo_skip);                           \
	HitSound* hitSound = hitObject->hitSound;                                  \
	fprintf(fp, "\"g\":[%d,%d,%d,%d],", hitSound->normal, hitSound->whistle,   \
			hitSound->finish, hitSound->clap);                                 \
	fprintf(fp, "\"h\":");                                                     \
	if (hitObject->type == 0)                                                  \
		fprintf(fp, "null,");                                                  \
	else if (hitObject->type == 1)                                             \
		jsonify_slider(hitObject->object, fp);                                 \
	else if (hitObject->type == 2)                                             \
		jsonify_spinner(hitObject->object, fp);                                \
	else if (hitObject->type == 3)                                             \
		jsonify_hold(hitObject->object, fp);                                   \
	HitSample* hitSample = hitObject->hitSample;                               \
	fprintf(fp, "\"i\":[%d,%d,%d,%d,\"%s\"]", hitSample->normalSet,            \
			hitSample->additionSet, hitSample->index, hitSample->volume,       \
			hitSample->filename);

void jsonify_hitObjects(const List* hitObjects, FILE* fp) {
	fprintf(fp, "\"h\":");
	fprintf(fp, "[");
	HitObject* hitObject = NULL;
	for (size_t i = 0; i < hitObjects->size - 1; i++) {
		hitObject = hitObjects->elements[i];
		jsonify_hitObject fprintf(fp, "},");
	}
	if (hitObjects->size > 0) {
		hitObject = hitObjects->elements[hitObjects->size - 1];
		jsonify_hitObject fprintf(fp, "}");
	}
	fprintf(fp, "]");
}

void jsonify_beatmap_to_file(Beatmap* beatmap, FILE* fp) {
	fprintf(fp, "{");
	jsonify_general(beatmap->general, fp);
	jsonify_editor(beatmap->editor, fp);
	jsonify_metadata(beatmap->metadata, fp);
	jsonify_difficulty(beatmap->difficulty, fp);
	jsonify_events(beatmap->events, fp);
	jsonify_timingPoints(beatmap->timingPoints, fp);
	jsonify_beatmapColours(beatmap->beatmapColours, fp);
	jsonify_hitObjects(beatmap->hitObjects, fp);
	fprintf(fp, "}");
}

void jsonify_beatmap(Beatmap* beatmap, char* path) {
	FILE* fp = fopen(path, "w+");
	if (fp == NULL) {
		ereport("fopen failed");
		return;
	}
	jsonify_beatmap_to_file(beatmap, fp);
	fclose(fp);
}
