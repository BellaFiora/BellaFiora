#include "parser.h"

#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include "../../c_utils/src/debug.h"

char unwanted[BUF_SIZE]; // used by remove_chars
size_t unwanted_size;
char line[BUF_SIZE]; // buffer for the current line
char buf[BUF_SIZE]; // buffer for parse functions
char tmp[BUF_SIZE]; // temporary buffer for utils functions

char* remove_chars(char* string) {
	if (string == NULL || unwanted_size == 0)
		return NULL;
	size_t length = strlen(string);
	size_t i = 0;
	size_t j = 0;
	while (i < length) {
		int remove = 0;
		for (j = 0; j < unwanted_size; j += 1) {
			if (string[i] == unwanted[j]) {
				remove = 1;
				break;
			}
		}
		if (remove) {
			for (size_t k = i; k < length - 1; k += 1) {
				string[k] = string[k + 1];
			}
			string[length - 1] = '\0';
			length -= 1;
		} else
			i += 1;
	}
	return string;
}

char* nremove_chars(char* string, size_t length) {
	if (string == NULL || unwanted_size == 0)
		return NULL;
	size_t i = 0;
	size_t j = 0;
	while (i < length) {
		int remove = 0;
		for (j = 0; j < unwanted_size; j += 1) {
			if (string[i] == unwanted[j]) {
				remove = 1;
				break;
			}
		}
		if (remove) {
			for (size_t k = i; k < length - 1; k += 1) {
				string[k] = string[k + 1];
			}
			string[length - 1] = '\0';
			length -= 1;
		} else
			i += 1;
	}
	return string;
}

void substring(char** out_ptr, char* string, int start_index, int end_index) {
	char* out = *out_ptr;
	int substring_length;
	if (end_index == -1) {
		strcpy(tmp, string);
		substring_length = strlen(remove_chars(tmp)) - start_index;
	} else {
		substring_length = end_index - start_index;
	}
	if (substring_length < 0) {
		ereport("subvec_length negative (%i)", substring_length);
		exit(1);
	}
	if (out == string)
		memmove(out, out + start_index, substring_length);
	else {
		out = realloc(out, (substring_length + 1) * sizeof(char));
		strncpy(out, string + start_index, substring_length);
	}
	out[substring_length] = '\0';
	nremove_chars(out, substring_length);
	*out_ptr = out;
}

void subvec(char* out, char* string, int start_index, int end_index) {
	int subvec_length;
	if (end_index == -1) {
		strcpy(tmp, string);
		subvec_length = strlen(remove_chars(tmp)) - start_index;
	} else {
		subvec_length = end_index - start_index;
	}
	if (subvec_length < 0) {
		ereport("subvec_length negative (%i)", subvec_length);
		exit(1);
	}
	if (out == string)
		memmove(out, out + start_index, subvec_length);
	else
		strncpy(out, string + start_index, subvec_length);
	out[subvec_length] = '\0';
	nremove_chars(out, subvec_length);
}

void subint(int* out_ptr, char* string, int start_index, int end_index) {
	int substring_length;
	if (end_index == -1) {
		substring_length = strlen(string) - start_index;
	} else {
		substring_length = end_index - start_index;
	}
	if (substring_length <= 0) {
		ereport("substring_length negative or null");
		return;
	}
	strncpy(tmp, string + start_index, substring_length);
	tmp[substring_length] = '\0';
	char* end_ptr;
	*out_ptr = strtol(nremove_chars(tmp, substring_length), &end_ptr, 10);
	if (*end_ptr != '\0') {
		// printf("tmp = '%s'\n", tmp);
		// printf("remove_chars(tmp) = '%s'\n", remove_chars(tmp));
		ereport("strtol failed");
		exit(1);
	}
}

void subfloat(float* out_ptr, char* string, int start_index, int end_index) {
	int substring_length;
	if (end_index == -1) {
		substring_length = strlen(string) - start_index;
	} else {
		substring_length = end_index - start_index;
	}
	if (substring_length <= 0) {
		ereport("substring_length negative or null");
		return;
	}
	strncpy(tmp, string + start_index, substring_length);
	tmp[substring_length] = '\0';
	char* end_ptr;
	*out_ptr = strtof(nremove_chars(tmp, substring_length), &end_ptr);
	if (*end_ptr != '\0') {
		ereport("subfloat failed");
		exit(1);
	}
}

void parse_filename(char** out_ptr, char* string) {
	char* out = *out_ptr;
	int string_length = strlen(string);
	string[string_length] = '\0';
	out = realloc(out, string_length + 1);
	strncpy(out, string, string_length);
	out[string_length] = '\0';
	nremove_chars(out, string_length);
	*out_ptr = out;
}

void parse_general(General* general) {
	if (strncmp(line, "AudioFilename", 13) == 0)
		substring(&(general->audioFilename), line, 15, -1);
	else if (strncmp(line, "AudioLeadIn", 11) == 0)
		subint(&general->audioLeadIn, line, 13, -1);
	else if (strncmp(line, "AudioHash", 9) == 0)
		substring(&(general->audioHash), line, 11, -1);
	else if (strncmp(line, "PreviewTime", 11) == 0)
		subint(&general->previewTime, line, 13, -1);
	else if (strncmp(line, "CountdownOffset", 15) == 0)
		subint(&general->countdownOffset, line, 17, -1);
	else if (strncmp(line, "Countdown", 9) == 0)
		subint(&general->countdown, line, 11, -1);
	else if (strncmp(line, "SampleSet", 9) == 0)
		substring(&(general->sampleSet), line, 11, -1);
	else if (strncmp(line, "StackLeniency", 13) == 0)
		subfloat(&general->stackLeniency, line, 15, -1);
	else if (strncmp(line, "Mode", 4) == 0)
		subint(&general->mode, line, 6, -1);
	else if (strncmp(line, "LetterboxInBreaks", 17) == 0)
		subint(&general->letterboxInBreaks, line, 19, -1);
	else if (strncmp(line, "StoryFireInFront", 16) == 0)
		subint(&general->storyFireInFront, line, 18, -1);
	else if (strncmp(line, "UseSkinSprites", 14) == 0)
		subint(&general->useSkinSprites, line, 16, -1);
	else if (strncmp(line, "AlwaysShowPlayfield", 19) == 0)
		subint(&general->alwaysShowPlayfield, line, 21, -1);
	else if (strncmp(line, "OverlayPosition", 15) == 0)
		substring(&(general->overlayPosition), line, 17, -1);
	else if (strncmp(line, "SkinPreference", 14) == 0)
		substring(&(general->skinPreference), line, 16, -1);
	else if (strncmp(line, "EpilepsyWarning", 15) == 0)
		subint(&general->epilepsyWarning, line, 17, -1);
	else if (strncmp(line, "SpecialStyle", 12) == 0)
		subint(&general->specialStyle, line, 14, -1);
	else if (strncmp(line, "WidescreenStoryboard", 20) == 0)
		subint(&general->widescreenStoryboard, line, 22, -1);
	else if (strncmp(line, "SamplesMatchPlaybackRate", 24) == 0)
		subint(&general->samplesMatchPlaybackRate, line, 26, -1);
	else {
		ereport("impossible case reached");
		exit(1);
	}
}

void parse_editor(Editor* editor) {
	if (strncmp(line, "Bookmarks", 9) == 0) {
		subvec(line, line, 11, -1);
		char* bookmark;
		bookmark = strtok(line, ",");
		while (bookmark != NULL) {
			char* end_ptr;
			long value = strtol(bookmark, &end_ptr, 10);
			if (*end_ptr != '\0') {
				ereport("strtol failed");
				exit(1);
			}
			ilist_add(editor->bookmarks, (int)value);
			bookmark = strtok(NULL, ",");
		}
	} else if (strncmp(line, "DistanceSpacing", 15) == 0)
		subfloat(&editor->distanceSpacing, line, 17, -1);
	else if (strncmp(line, "BeatDivisor", 11) == 0)
		subint(&editor->beatDivisor, line, 13, -1);
	else if (strncmp(line, "GridSize", 8) == 0)
		subint(&editor->gridSize, line, 10, -1);
	else if (strncmp(line, "TimelineZoom", 12) == 0)
		subfloat(&editor->timelineZoom, line, 14, -1);
	else {
		ereport("impossible case reached (%s)", line);
		exit(1);
	}
}

void parse_metadata(Metadata* metadata) {
	if (strncmp(line, "TitleUnicode:", 13) == 0) { substring(&(metadata->titleUnicode), line, 13, -1); }
	else if (strncmp(line, "Title:", 6) == 0) { substring(&(metadata->title), line, 6, -1); }
	else if (strncmp(line, "ArtistUnicode:", 14) == 0) { substring(&(metadata->artistUnicode), line, 14, -1); }
	else if (strncmp(line, "Artist:", 7) == 0) { substring(&(metadata->artist), line, 7, -1); }
	else if (strncmp(line, "Creator:", 8) == 0) { substring(&(metadata->creator), line, 8, -1); }
	else if (strncmp(line, "Version:", 8) == 0) { substring(&(metadata->version), line, 8, -1); }
	else if (strncmp(line, "Source:", 7) == 0) { substring(&(metadata->source), line, 7, -1); }
	else if (strncmp(line, "Tags:", 5) == 0) {
		subvec(line, line, 5, -1);
		char* tag;
		tag = strtok(line, " ");
		while (tag != NULL) {
			slist_add(metadata->tags, tag);
			tag = strtok(NULL, " ");
		}
	}
	else if (strncmp(line, "BeatmapID:", 10) == 0) { subint(&metadata->beatmapId, line, 10, -1); }
	else if (strncmp(line, "BeatmapSetID:", 13) == 0) { subint(&metadata->beatmapSetId, line, 13, -1); }
	else { ereport("impossible case reached"); exit(1); }
}

void parse_difficulty(Difficulty* difficulty) {
	if (strncmp(line, "HPDrainRate", 11) == 0)
		subfloat(&difficulty->hpDrainRate, line, 12, -1);
	else if (strncmp(line, "CircleSize", 10) == 0)
		subfloat(&difficulty->circleSize, line, 11, -1);
	else if (strncmp(line, "OverallDifficulty", 17) == 0)
		subfloat(&difficulty->overallDifficulty, line, 18, -1);
	else if (strncmp(line, "ApproachRate", 12) == 0)
		subfloat(&difficulty->approachRate, line, 13, -1);
	else if (strncmp(line, "SliderMultiplier", 16) == 0)
		subfloat(&difficulty->sliderMultiplier, line, 17, -1);
	else if (strncmp(line, "SliderTickRate", 14) == 0)
		subfloat(&difficulty->sliderTickRate, line, 15, -1);
	else {
		ereport("impossible case reached");
		exit(1);
	}
	return;
}

void parse_backgroundEvent(Event* event) {
	char* token;
	event->type = 0;
	event->event = new_backgroundEvent();
	BackgroundEvent* cur_event = (BackgroundEvent*)event->event;
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete event, missing filename");
		return;
	}
	parse_filename(&(cur_event->filename), token);
	token = strtok(NULL, ",");
	if (token == NULL) {
		cur_event->xOffset = 0;
		cur_event->yOffset = 0;
		return;
	}
	subint(&cur_event->xOffset, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		cur_event->yOffset = 0;
		return;
	}
	subint(&cur_event->yOffset, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL)
		return;
	ereport("impossible case reached");
	exit(1);
}

void parse_videoEvent(Event* event) {
	char* token;
	event->type = 1;
	event->event = new_videoEvent();
	VideoEvent* cur_event = (VideoEvent*)event->event;
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete event, missing filename");
		return;
	}
	parse_filename(&(cur_event->filename), token);
	token = strtok(NULL, ",");
	if (token == NULL) {
		cur_event->xOffset = 0;
		cur_event->yOffset = 0;
		return;
	}
	subint(&cur_event->xOffset, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		cur_event->yOffset = 0;
		return;
	}
	subint(&cur_event->yOffset, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL)
		return;
	ereport("impossible case reached");
	exit(1);
}

void parse_breakEvent(Event* event) {
	char* token;
	event->type = 2;
	event->event = new_breakEvent();
	BreakEvent* cur_event = (BreakEvent*)event->event;
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete event, missing endTime");
		return;
	}
	subint(&cur_event->endTime, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL)
		return;
	ereport("impossible case reached");
	exit(1);
}

void parse_events(List* events) {
	char* token;
	strcpy(buf, strtok(line, ","));
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete event, missing startTime");
		return;
	}
	Event* event = new_event();
	subint(&event->startTime, token, 0, -1);
	if (strlen(buf) == 1) {
		if (strncmp(buf, "0", 1) == 0)
			parse_backgroundEvent(event);
		else if (strncmp(buf, "1", 1) == 0)
			parse_videoEvent(event);
		else if (strncmp(buf, "2", 1) == 0)
			parse_breakEvent(event);
		else {
			ereport("impossible case1 reached (%s)", buf);
			exit(1);
		}
	} else {
		if (strncmp(buf, "Background", 10) == 0)
			parse_backgroundEvent(event);
		else if (strncmp(buf, "Video", 5) == 0)
			parse_videoEvent(event);
		else if (strncmp(buf, "Break", 5) == 0)
			parse_breakEvent(event);
		else {
			ereport("impossible case2 reached (%s)", buf);
			exit(1);
		}
	}
	list_add(events, event);
}

void parse_timingPoints(List* timingPoints) {
	char* token;
	TimingPoint* timingPoint = new_timingPoint();
	token = strtok(line, ",");
	if (token == NULL) {
		ereport("incomplete timingPoint, missing time");
		return;
	}
	subint(&timingPoint->time, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete timingPoint, missing beatLength");
		return;
	}
	subfloat(&timingPoint->beatLength, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete timingPoint, missing meter");
		return;
	}
	subint(&timingPoint->meter, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete timingPoint, missing sampleSet");
		return;
	}
	subint(&timingPoint->sampleSet, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete timingPoint, missing sampleIndex");
		return;
	}
	subint(&timingPoint->sampleIndex, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete timingPoint, missing volume");
		return;
	}
	subint(&timingPoint->volume, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete timingPoint, missing uninherited");
		return;
	}
	subint(&timingPoint->uninherited, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete timingPoint, missing effects");
		return;
	}
	subint(&timingPoint->effects, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		list_add(timingPoints, timingPoint);
		return;
	}
	ereport("impossible case reached");
	exit(1);
}

void parse_beatmapColours(List* beatmapColours) {
	char* token;
	BeatmapColour* beatmapColour = new_beatmapColour();
	int beatmapColour_start = 0;
	if (strncmp(line, "Combo", 5) == 0) {
		beatmapColour->type = 0;
		beatmapColour->object = new_beatmapComboColour();
		char* found = strchr(line, ':');
		if (found == NULL) {
			ereport("impossible case reached");
			exit(1);
		}
		size_t end_index = found - line;
		subint(&((BeatmapComboColour*)beatmapColour->object)->combo, line, 5,
			   end_index - 1);
		beatmapColour_start = end_index + 2;
	} else if (strncmp(line, "SliderTrackOverride", 19) == 0) {
		beatmapColour->type = 1;
		beatmapColour_start = 22;
	} else if (strncmp(line, "SliderBorder", 12) == 0) {
		beatmapColour->type = 2;
		beatmapColour_start = 15;
	} else {
		ereport("impossible case reached");
		exit(1);
	}
	subvec(line, line, beatmapColour_start, -1);
	token = strtok(line, ",");
	if (token == NULL) {
		ereport("incomplete BeatmapColour object, missing red");
		return;
	}
	subint(&beatmapColour->red, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete BeatmapColour object, missing green");
		return;
	}
	subint(&beatmapColour->green, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete BeatmapColour object, missing blue");
		return;
	}
	subint(&beatmapColour->blue, token, 0, -1);
	list_add(beatmapColours, beatmapColour);
	if (strtok(NULL, ",") != NULL) {
		ereport("impossible case reached");
		exit(1);
	}
}

char* parse_curvePoint(Slider* slider, char* token) {
	char* colon = strchr(token, ':');
	if (colon == NULL) {
		ereport("wrong CurvePoint format (%s)", token);
		exit(1);
	}
	CurvePoint* curvePoint = new_curvePoint();
	int end_index = colon - token;
	subint(&curvePoint->x, token, 0, end_index);
	subint(&curvePoint->y, token, end_index + 1, -1);
	list_add(slider->curvePoints, curvePoint);
	return strtok(NULL, "|");
}

char* parse_edgeSound(Slider* slider, char* token) {
	int edgeSound;
	subint(&edgeSound, token, 0, -1);
	ilist_add(slider->edgeSounds, edgeSound);
	return strtok(NULL, "|");
}

char* parse_edgeSet(Slider* slider, char* token) {
	char* colon = strchr(token, ':');
	if (colon == NULL) {
		ereport("wrong EdgeSet format");
		exit(1);
	}
	EdgeSet* edgeSet = new_edgeSet();
	int end_index = colon - token;
	substring(&(edgeSet->normalSet), token, 0, end_index);
	substring(&(edgeSet->additionSet), token, end_index + 1, -1);
	list_add(slider->edgeSets, edgeSet);
	return strtok(NULL, "|");
}

void parse_hitSample(HitObject* hitObject, char* token) {
	token = strtok(token, ":");
	if (token == NULL)
		return;
	subint(&hitObject->hitSample->normalSet, token, 0, -1);
	token = strtok(NULL, ":");
	if (token == NULL)
		return;
	subint(&hitObject->hitSample->additionSet, token, 0, -1);
	token = strtok(NULL, ":");
	if (token == NULL)
		return;
	subint(&hitObject->hitSample->index, token, 0, -1);
	token = strtok(NULL, ":");
	if (token == NULL)
		return;
	subint(&hitObject->hitSample->volume, token, 0, -1);
	token = strtok(NULL, "");
	if (strncmp(token, "\r\n", 2) == 0)
		return;
	parse_filename(&(hitObject->hitSample->filename), token);
}

void parse_hitSample_hold(HitObject* hitObject, char* token) {
	token = strtok(token, ":");
	if (token == NULL)
		return;
	subint(&hitObject->hitSample->normalSet, token, 0, -1);
	token = strtok(NULL, ":");
	if (token == NULL)
		return;
	subint(&hitObject->hitSample->additionSet, token, 0, -1);
	token = strtok(NULL, ":");
	if (token == NULL)
		return;
	subint(&hitObject->hitSample->index, token, 0, -1);
	token = strtok(NULL, ":");
	if (token == NULL)
		return;
	subint(&hitObject->hitSample->volume, token, 0, -1);
	token = strtok(NULL, ":");
	if (token == NULL)
		return;
	subint(&hitObject->hitSample->volume, token, 0, -1);
	token = strtok(NULL, "");
	if (strncmp(token, "\r\n", 2) == 0)
		return;
	parse_filename(&(hitObject->hitSample->filename), token);
}

char* parse_slider(HitObject* hitObject) {
	char* token;
	char* next_token;
	Slider* slider = new_slider();
	hitObject->type = 1;
	hitObject->object = slider;
	token = strtok(NULL, "|");
	if (token == NULL) {
		ereport("incomplete Slider, missing curveType");
		return NULL;
	}
	slider->curveType = token[0];
	token = strtok(NULL, ",");
	strcpy(buf, token);
	next_token = token + strlen(buf) + 1;
	token = strtok(buf, "|");
	while (token != NULL)
		token = parse_curvePoint(slider, token);
	token = strtok(next_token, ",");
	if (token == NULL) {
		ereport("incomplete Slider, missing slides");
		return NULL;
	}
	subint(&slider->slides, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete Slider, missing length");
		return NULL;
	}
	subfloat(&slider->length, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL)
		return NULL;
	strcpy(buf, token);
	next_token = token + strlen(buf) + 1;
	token = strtok(buf, "|");
	while (token != NULL)
		token = parse_edgeSound(slider, token);
	token = strtok(next_token, ",");
	if (token == NULL)
		return NULL;
	strcpy(buf, token);
	next_token = token + strlen(buf) + 1;
	token = strtok(buf, "|");
	while (token != NULL)
		token = parse_edgeSet(slider, token);
	return next_token;
}

char* parse_spinner(HitObject* hitObject) {
	char* token;
	Spinner* spinner = new_spinner();
	hitObject->type = 2;
	hitObject->object = spinner;
	token = strtok(NULL, ",");
	subint(&spinner->endTime, token, 0, -1);
	return strtok(NULL, "");
}

char* parse_hold(HitObject* hitObject, char* token) {
	Hold* hold = new_hold();
	hitObject->type = 3;
	hitObject->object = hold;
	subint(&hold->endTime, token, 0, -1);
	return strtok(NULL, "");
}

void parse_hitObject(List* hitObjects) {
	char* token;
	HitObject* hitObject = new_hitObject();
	token = strtok(line, ",");
	if (token == NULL) {
		ereport("incomplete hitObject, missing x");
		return;
	}
	subint(&hitObject->x, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete hitObject, missing y");
		return;
	}
	subint(&hitObject->y, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete hitObject, missing time");
		return;
	}
	subint(&hitObject->time, token, 0, -1);
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete hitObject, missing type");
		return;
	}
	int type_flags;
	subint(&type_flags, token, 0, -1);
	hitObject->new_combo = (type_flags & 0b00000100) ? 1 : 0;
	hitObject->combo_skip = (type_flags & 0b01110000) >> 4;
	token = strtok(NULL, ",");
	if (token == NULL) {
		ereport("incomplete hitObject, missing hitSound");
		return;
	}
	int hitSound_flags;
	subint(&hitSound_flags, token, 0, -1);
	if (hitSound_flags != 0) {
		hitObject->hitSound->normal = hitSound_flags & 0b0001;
		hitObject->hitSound->whistle = (hitSound_flags & 0b0010) ? 1 : 0;
		hitObject->hitSound->finish = (hitSound_flags & 0b0100) ? 1 : 0;
		hitObject->hitSound->clap = (hitSound_flags & 0b1000) ? 1 : 0;
	}
	char* next_token = NULL;
	int type = type_flags & 0b10001011;
	if (type == 1)
		next_token = strtok(NULL, "");
	else if (type == 2)
		next_token = parse_slider(hitObject);
	else if (type == 8)
		next_token = parse_spinner(hitObject);
	else if (type == 128) {
		next_token = parse_hold(hitObject, token);
		parse_hitSample_hold(hitObject, next_token);
		list_add(hitObjects, hitObject);
		return;
	} else {
		ereport("unkown type (%i)", type);
		return;
	}
	parse_hitSample(hitObject, next_token);
	list_add(hitObjects, hitObject);
}

// #define DEBUG

#ifdef DEBUG
#	define DEBUG_LINE 33
int debug_function(int line_count) {
	printf("%s", line);
	if (line_count + 2 > DEBUG_LINE)
		exit(0);
	return line_count + 1;
}
#endif

Beatmap* parse_beatmap(char* osuFile) {
	strcpy(unwanted, " \r\n\"");
	unwanted_size = 4;
	FILE* file = fopen(osuFile, "r");
	if (file == NULL) {
		ereport("fopen failed");
		return NULL;
	}
	Beatmap* beatmap = new_beatmap();
	if (beatmap == NULL) {
		ereport("new_beatmap failed");
		return NULL;
	}
#ifdef DEBUG
	int line_count = 0;
#endif
	while (fgets(line, sizeof(line), file)) {
#ifdef DEBUG
		line_count = debug_function(line_count);
#endif
		if (line[1] == '\n' || (line[0] == '/' && line[1] == '/'))
			continue;
		else if (strncmp(line, "osu file format v", 17) == 0) {
			if (line[17] != '1' || line[18] != '4') {
				ereport("does not support other osu file format "
						"than 14 (unsure yet, safety first)");
			}
			char versionStr[3] = {line[17], line[18], '\0'};
			if (!isdigit((int)line[18]))
				versionStr[1] = '\0';
			beatmap->general->version = atoi(versionStr);
		} else if (strncmp(line, "[General]", 9) == 0) {
			while (fgets(line, sizeof(line), file)) {
#ifdef DEBUG
				line_count = debug_function(line_count);
#endif
				if (line[1] == '\n')
					break;
				else if (line[0] != '/' && line[1] != '/')
					parse_general(beatmap->general);
			}
		} else if (strncmp(line, "[Editor]", 8) == 0) {
			while (fgets(line, sizeof(line), file)) {
#ifdef DEBUG
				line_count = debug_function(line_count);
#endif
				if (line[1] == '\n')
					break;
				else if (line[0] != '/' && line[1] != '/')
					parse_editor(beatmap->editor);
			}
		} else if (strncmp(line, "[Metadata]", 10) == 0) {
			strcpy(unwanted, "\r\n\"");
			unwanted_size = 3;
			while (fgets(line, sizeof(line), file)) {
#ifdef DEBUG
				line_count = debug_function(line_count);
#endif
				if (line[1] == '\n')
					break;
				else if (line[0] != '/' && line[1] != '/')
					parse_metadata(beatmap->metadata);
			}
			strcpy(unwanted, " \r\n\"");
			unwanted_size = 4;
		} else if (strncmp(line, "[Difficulty]", 12) == 0) {
			while (fgets(line, sizeof(line), file)) {
#ifdef DEBUG
				line_count = debug_function(line_count);
#endif
				if (line[1] == '\n')
					break;
				else if (line[0] != '/' && line[1] != '/')
					parse_difficulty(beatmap->difficulty);
			}
		} else if (strncmp(line, "[Events]", 8) == 0) {
			while (fgets(line, sizeof(line), file)) {
#ifdef DEBUG
				line_count = debug_function(line_count);
#endif
				if (line[1] == '\n')
					break;
				else if (line[0] != '/' && line[1] != '/')
					parse_events(beatmap->events);
			}
		} else if (strncmp(line, "[TimingPoints]", 14) == 0) {
			while (fgets(line, sizeof(line), file)) {
#ifdef DEBUG
				line_count = debug_function(line_count);
#endif
				if (line[1] == '\n')
					break;
				else if (line[0] != '/' && line[1] != '/')
					parse_timingPoints(beatmap->timingPoints);
			}
		} else if (strncmp(line, "[Colours]", 9) == 0) {
			strcpy(unwanted, "\r\n\"");
			unwanted_size = 3;
			while (fgets(line, sizeof(line), file)) {
#ifdef DEBUG
				line_count = debug_function(line_count);
#endif
				if (line[1] == '\n')
					break;
				else if (line[0] != '/' && line[1] != '/')
					parse_beatmapColours(beatmap->beatmapColours);
			}
			strcpy(unwanted, " \r\n\"");
			unwanted_size = 4;
		} else if (strncmp(line, "[HitObjects]", 12) == 0) {
			while (fgets(line, sizeof(line), file)) {
#ifdef DEBUG
				line_count = debug_function(line_count);
#endif
				if (line[1] == '\n')
					break;
				else if (line[0] != '/' && line[1] != '/')
					parse_hitObject(beatmap->hitObjects);
			}
		}
	}
	fclose(file);
	float AR = beatmap->difficulty->approachRate;
	beatmap->difficulty->preempt = 1200;
	beatmap->difficulty->fade_in = 800;
	if (AR == 5) return beatmap;
	if (AR < 5) {
		beatmap->difficulty->preempt += 600 * (5 - AR) / 5;
		beatmap->difficulty->fade_in += 400 * (5 - AR) / 5;
		return beatmap;
	} 
	beatmap->difficulty->preempt -= 750 * (AR - 5) / 5;
	beatmap->difficulty->fade_in -= 500 * (AR - 5) / 5;
	return beatmap;
}
