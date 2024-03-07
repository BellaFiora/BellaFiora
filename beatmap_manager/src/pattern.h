

typedef struct {
	// list of pointers of objects in the previous iteration
	List* objects; // HitObject*
	List* children; // Pattern*
	Data* data; // ???
} Pattern;

void merge(Pattern* a, Pattern* b) {
	// magic...
}

float distance(Pattern* a, Pattern* b) {
	// magic...
}

void get_window(Pattern** patterns) {
	// ...
}

void force_merge(Pattern** sections, Pattern* root) {
	// ...
}

Pattern** working_patterns;
Pattern** next_working_patterns;	// [d, e]
init(working_patterns, hitObjects); // [a, b, c]
primary_patterns(working_patterns, next_working_patterns);
working_patterns = next_working_patterns;
next_working_patterns.clear();
do {
	float threshold = 0.5;
	List* window;
	bool done = true;
	for (size_t i = 0; i < len(working_patterns) - 1; i++) {
		Pattern* a = working_patterns[i];
		Pattern* b = working_patterns[i + 1];
		if (distance(a, b, ...) < threshold) {
			merge(a, b, res, ...);
			next_working_patterns.append(res);
			done = false;
		}
	}
	working_patterns = next_working_patterns;
	next_working_patterns.clear();
} while (len(working_patterns) > 1 || done);

Pattern* root;
force_merge(working_patterns, root)
