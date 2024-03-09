#ifndef BEATMAP_MANAGER_STRUCTS_H
#define BEATMAP_MANAGER_STRUCTS_H

typedef struct {
	// .osubf version
	/*COMPRESSED*/ unsigned char version;
	
	// General of .osu
	
	/*COMPRESSED*/ unsigned char beatmap_version;
	
	// if audioFilename had more than 256 characters, it will end with "..."
	// ask the .osu from osu.ppy.sh if you really need the full one
	/*COMPRESSED*/ unsigned char audioFilenameSize;
	/*COMPRESSED*/ char* audioFilename;
	
	/*COMPRESSED*/ unsigned int audioLeadIn;
	
	/*COMPRESSED*/ unsigned int previewTime;
	
	/*COMPRESSED*/ unsigned char countdown;
	
	/*COMPRESSED*/ unsigned char sampleSetSize;
	/*COMPRESSED*/ char* sampleSet;
	
	float stackLeniency;
	
	unsigned char mode; // 0 std 1 taiko 2 ctb 3 mania
	
	/*COMPRESSED*/ unsigned char overlayPositionSize;
	/*COMPRESSED*/ char* overlayPosition;
	
	// if skinPreference had more than 256 characters, it will end with "..."
	// ask the .osu from osu.ppy.sh if you really need the full one
	/*COMPRESSED*/ unsigned char skinPreferenceSize;
	/*COMPRESSED*/ char* skinPreference;
	
	/*COMPRESSED*/ unsigned int countdownOffset;

	/* bits meaning in order:
		- LetterboxInBreaks
		- UseSkinSprites
		- EpilepsyWarning
		- SpecialStyle
		- WidescreenStoryboard
		- SamplesMatchPlaybackRate
		- ...
		- ...
	*/
	/*COMPRESSED*/ char flags;

	// Metadata of .osu

	unsigned short titleSize;
	char* title;

	unsigned short titleUnicodeSize;
	char* titleUnicode;
	
	unsigned short artistSize;
	char* artist;
	
	unsigned short artistUnicodeSize;
	char* artistUnicode;
	
	unsigned char creatorSize;
	char* creator;
	
	/*COMPRESSED*/ unsigned short difficultyNameSize;
	/*COMPRESSED*/ char* difficultyName;
	
	unsigned short sourceSize;
	char* source;

	sList* tags;

	unsigned long beatmapId;
	unsigned long beatmapSetId;

	// Metadata of .osu

	float hpDrainRate;

	float circleSize;

	float overallDifficulty;

	float approachRate;

	/*COMPRESSED*/ float preempt;

	/*COMPRESSED*/ float fade_in;

	/*COMPRESSED*/ float sliderMultiplier;

	/*COMPRESSED*/ float sliderTickRate;

	// Patterns / Skillsets

	unsigned short main_skillset;

	unsigned short* patterns;

	iList* patternsProportions;

	iList* patternsPositions;

} osubf;

#endif