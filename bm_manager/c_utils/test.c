#include <time.h>

#include "all.h"

/* init example

    char *argv[] = { "script", "-fi",        "--path",   "src",      "foo",
                     "bar",    "--path",     "dist",     "--output", "baz",
                     "-d",     "GNU_SOURCE", "--define", "DEBUG",    NULL };

    char *force_shorts[] = { "f", NULL };
    char *force_longs[] = { "force", NULL };
    char *verbose_shorts[] = { "v", NULL };
    char *verbose_longs[] = { "verbose", NULL };
    char *install_shorts[] = { "i", NULL };
    char *install_longs[] = { "install", NULL };
    char *output_longs[] = { "output", "path", NULL };
    char *define_longs[] = { "define", NULL };

    struct Option options[] = { { 0, force_shorts, force_longs },
                                { 0, verbose_shorts, verbose_longs },
                                { 0, install_shorts, install_longs },
                                { 1, NULL, output_longs },
                                { 1, NULL, define_longs },
                                { 0, NULL, NULL } };

    char *default_result_arguments[] = { "main.c", NULL };
    char *default_result_options_values[] = { "0", NULL, "1", NULL, NULL };

    struct Results default_result = { .arguments = default_result_arguments,
                                      .options_values =
                                          default_result_options_values };

    struct ParseOptions parse_options = { .ignore_first = 1,
                                          .default_result = &default_result,
                                          .default_help = 1,
                                          .default_help_value = 1 };

*/

/* init echo

    char *argv[] = { "echo", "-en", "pairs lists:", NULL };

    char *newline_shorts[] = { "n", NULL };
    char *enable_escapes_shorts[] = { "e", NULL };
    char *disable_escapes_shorts[] = { "E", NULL };
    char *help_longs[] = { "help", NULL };
    char *version_longs[] = { "version", NULL };

    struct Option options[] = {
        { 0, newline_shorts, NULL },         { 0, enable_escapes_shorts, NULL },
        { 0, disable_escapes_shorts, NULL }, { 0, NULL, help_longs },
        { 0, NULL, version_longs },          { 0, NULL, NULL }
    };

    char *default_result_options_values[] = { "0", "0", "1", "0", "0" };

    struct Results default_result = { .arguments = NULL,
                                      .options_values =
                                          default_result_options_values };

    struct ParseOptions parse_options = { .ignore_first = 1,
                                          .default_result = &default_result,
                                          .default_help = 0,
                                          .default_help_value = 0 };

*/

void test_parse_args(void)
{
    // Init

    char *argv[] = { "script", "-fi",        "--path",   "src",      "foo",
                     "bar",    "--path",     "dist",     "--output", "baz",
                     "-d",     "GNU_SOURCE", "--define", "DEBUG",    NULL };

    char *force_shorts[] = { "f", NULL };
    char *force_longs[] = { "force", NULL };
    char *verbose_shorts[] = { "v", NULL };
    char *verbose_longs[] = { "verbose", NULL };
    char *install_shorts[] = { "i", NULL };
    char *install_longs[] = { "install", NULL };
    char *output_longs[] = { "output", "path", NULL };
    char *define_longs[] = { "define", NULL };

    struct Option options[] = { { 0, force_shorts, force_longs },
                                { 0, verbose_shorts, verbose_longs },
                                { 0, install_shorts, install_longs },
                                { 1, NULL, output_longs },
                                { 1, NULL, define_longs },
                                { 0, NULL, NULL } };

    char *default_result_arguments[] = { "main.c", NULL };
    char *default_result_options_values[] = { "0", NULL, "1", NULL, NULL };

    struct Results default_result = { .arguments = default_result_arguments,
                                      .options_values =
                                          default_result_options_values };

    struct ParseOptions parse_options = { .ignore_first = 1,
                                          .default_result = &default_result,
                                          .default_help = 1,
                                          .default_help_value = 1 };

    // Parse

    struct Results *results =
        parse_command_line_arguments(argv, options, &parse_options);

    // Print

    printf("Arguments:\n");
    for (size_t i = 0; i < results->nb_args; i++)
        printf("%s\n", results->arguments[i]);

    printf("\nParsed Options:\n");
    for (size_t i = 0; i < 5 + (parse_options.default_help == 1); i++)
        printf("%s\n",
               results->options_values[i] ? results->options_values[i]
                                          : "NULL");

    // Cleanup

    free_results(results);
}

void test_slist(void)
{
    sList *l = new_slist(1);
    slist_add(l, NULL);
    pprint_slist(l, 2);
    free_slist(l);
}

#ifndef _WIN32

int main(int argc, char* argv[]){
	clock_t begin = clock();
	test_parse_args();
	clock_t end = clock();
	double time_spent = (double)(end - begin) / CLOCKS_PER_SEC;
	printf("time of execution: %lf\n", time_spent);
	return 0;
}

#else

#include <windows.h>
int WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow){
	clock_t begin = clock();
	// ...
	clock_t end = clock();
	double time_spent = (double)(end - begin) / CLOCKS_PER_SEC;
	printf("time of execution: %lf\n", time_spent);
	return 0;
}

#endif