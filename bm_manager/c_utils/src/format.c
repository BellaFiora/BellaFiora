#include "format.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "list.h"

static void parse_command_line_arguments_init_default_result(
    struct ParseOptions* parse_options,struct Option* options,
    size_t nb_options, struct Results** results) {

    // initialize with the default_result arguments
    if (parse_options->default_result->arguments != NULL) {
        for (size_t i = 0; parse_options->default_result->arguments[i] != NULL; i++) {
            (*results)->arguments = realloc((*results)->arguments, (i + 1) * sizeof(char*));
            (*results)->arguments[i] = parse_options->default_result->arguments[i];
            (*results)->nb_args++;
        }
    }
    // initialize with the default_result options values
    if (parse_options->default_result->options_values != NULL) {
        for (size_t i = 0; i < nb_options; i++) {
            if (!options[i].takes_arg && parse_options->default_result->options_values[i] == NULL)
                continue;
            (*results)->options_values[i] = parse_options->default_result->options_values[i];
        }
    }
}

static void parse_command_line_arguments_init(
    char** argv, struct Option* options, struct ParseOptions* parse_options,
    size_t* argc, size_t* nb_options, struct Results** results) {

    *argc = 0;
    while (argv[*argc] != NULL)
        (*argc)++;

    *nb_options = 0;
    while (options[*nb_options].shorts != NULL || options[*nb_options].longs != NULL)
        (*nb_options)++;

    *results = calloc(1, sizeof(struct Results));
    (*results)->arguments = NULL;
    (*results)->nb_args = 0;
    (*results)->options_values = calloc(*nb_options, sizeof(char*));
    (*results)->options_found = 0;

    for (size_t i = 0; i < *nb_options; i++)
        (*results)->options_values[i] = "0";

    if (parse_options->default_result != NULL)
        parse_command_line_arguments_init_default_result(parse_options, options,
                                                         *nb_options, results);

    if (parse_options->default_help != 0) {
        // use the fact that options must be terminated
        // by an empty option { 0, NULL, NULL }
        // so nb_options is a valid index
        options[*nb_options].takes_arg = 0;
        options[*nb_options].shorts = calloc(2, sizeof(char*));
        options[*nb_options].shorts[0] = "h";
        options[*nb_options].shorts[1] = NULL;
        options[*nb_options].longs = calloc(2, sizeof(char*));
        options[*nb_options].longs[0] = "help";
        options[*nb_options].longs[1] = NULL;
        (*results)->options_values = realloc((*results)->options_values, (*nb_options + 1) * sizeof(char*));
        (*results)->options_values[*nb_options] = "0";
        (*nb_options)++;
    }
}

static int str_array_contains(char** array, char* s) {
    if (array == NULL)
        return 0;
    for (size_t i = 0; array[i] != NULL; i++)
        if (strcmp(array[i], s) == 0)
            return 1;
    return 0;
}

static int parse_command_line_arguments_long_option_case(
    size_t k, size_t* i, int takes_arg, size_t argc, char* argv[],
    struct Results* results) {

    if (takes_arg) {
        if (*i + 1 < argc) {
            results->options_values[k] = argv[*i + 1];
            results->options_found++;
        }
        (*i)++;
    }
    else {
        results->options_values[k] = "1";
        results->options_found++;
    }
    return 0;
}

static int parse_command_line_arguments_short_option_e_len_2_case(
    size_t k, size_t argc, char* argv[], size_t* i, struct Option* options,
    struct Results* results) {

    if (options[k].takes_arg) {
        if (*i + 1 < argc) {
            results->options_values[k] = argv[*i + 1];
            results->options_found++;
        }
        (*i)++;
    }
    else {
        results->options_values[k] = "1";
        results->options_found++;
    }
    return 0;
}

static void parse_command_line_arguments_short_option_for_loop(
    struct Option* options, size_t* i, char* argv[], struct Results* results,
    iList* multiple_short_options_indicies, size_t nb_options, char* e) {

    for (size_t c = 2; e[c] != '\0'; c++) {
        int option_index = -1;
        for (size_t o = 0; o < nb_options; o++) {
            char tmp[2] = { e[c], '\0' };
            if (str_array_contains(options[o].shorts, tmp)) {
                option_index = o;
                break;
            }
        }
        if (option_index == -1) {
            clear_ilist(multiple_short_options_indicies);
            break;
        }
        if (options[option_index].takes_arg) {
            if (e[c + 1] != '\0') {
                clear_ilist(multiple_short_options_indicies);
                break;
            }
            results->options_values[option_index] = argv[*i + 1];
            results->options_found++;
            break;
        }
        ilist_add(multiple_short_options_indicies, option_index);
    }
}

static int parse_command_line_arguments_short_option_case(
    size_t k, struct Option* options, size_t* i, char* argv[],
    struct Results* results, iList** multiple_short_options_indicies,
    size_t nb_options, char* e) {

    int is_arg = 1;
    if (options[k].takes_arg)
        return is_arg;
    if (*multiple_short_options_indicies == NULL)
        *multiple_short_options_indicies = new_ilist(1);
    ilist_add(*multiple_short_options_indicies, k);

    parse_command_line_arguments_short_option_for_loop(
        options, i, argv, results, *multiple_short_options_indicies, nb_options, e);

    if ((*multiple_short_options_indicies)->size > 0) {
        is_arg = 0;
        for (size_t o = 0; o < (*multiple_short_options_indicies)->size; o++) {
            size_t index = (*multiple_short_options_indicies)->elements[o];
            results->options_values[index] = "1";
            results->options_found++;
        }
    }

    return is_arg;
}

static void
parse_command_line_arguments_help(struct ParseOptions* parse_options,
                                  struct Option* options, int nb_options,
                                  struct Results* results) {

    if (parse_options->default_help) {
        // a default_help was requested
        // free the temporary default shorts and longs of the help
        free(options[nb_options - 1].shorts);
        free(options[nb_options - 1].longs);
        options[nb_options - 1].shorts = NULL;
        options[nb_options - 1].longs = NULL;
        if (parse_options->default_help_value && results->nb_args == 0 && results->options_found == 0)
            // help was requested to be true if
            // no arguments nor options were found
            results->options_values[nb_options - 1] = "1";
    }
}

static int parse_command_line_arguments_for_loop(
    char* e, int e_len, size_t nb_options, struct Option* options, size_t argc,
    char* argv[], struct Results* results, size_t* i,
    iList** multiple_short_options_indicies) {

    char possible_short[2] = { '\0', '\0' };
    if (e_len > 1)
        possible_short[0] = e[1];
    int is_arg = 1;
    for (size_t k = 0; k < nb_options; k++) {
        if (e_len >= 3 && e[0] == '-' && e[1] == '-' && str_array_contains(options[k].longs, e + 2)) {
            is_arg = parse_command_line_arguments_long_option_case(
                k, i, options[k].takes_arg, argc, argv, results);
            break;
        }
        else if (e_len >= 2 && e[0] == '-' && str_array_contains(options[k].shorts, possible_short)) {
            if (e_len == 2) {
                is_arg = parse_command_line_arguments_short_option_e_len_2_case(
                    k, argc, argv, i, options, results);
                break;
            }
            is_arg = parse_command_line_arguments_short_option_case(
                k, options, i, argv, results, multiple_short_options_indicies,
                nb_options, e);
            break;
        }
    }
    return is_arg;
}

struct Results* parse_command_line_arguments(char** argv,
                                             struct Option* options,
                                             struct ParseOptions* parse_options) {

    // Init
    size_t argc = 0;
    size_t nb_options = 0;
    struct Results* results = NULL;
    parse_command_line_arguments_init(argv, options, parse_options, &argc,
                                      &nb_options, &results);

    // Parse argv
    size_t i = parse_options->ignore_first ? 1 : 0;
    iList* multiple_short_options_indicies = NULL;

    while (i < argc) {
        char* e = argv[i];
        size_t e_len = strlen(e);

        int is_arg = parse_command_line_arguments_for_loop(
            e, e_len, nb_options, options, argc, argv, results, &i,
            &multiple_short_options_indicies);

        if (is_arg) {
            results->arguments = realloc(
                results->arguments, (results->nb_args + 1) * sizeof(char*));
            results->arguments[results->nb_args++] = e;
        }
        i++;
    }

    if (multiple_short_options_indicies)
        free_ilist(multiple_short_options_indicies);

    parse_command_line_arguments_help(parse_options, options, nb_options, results);

    return results;
}

void free_results(struct Results* results) {
    if (results == NULL)
        return;
    // all arguments come from stack allocated variables
    // either from parse_options->default_results.arguments or argv
    // for (size_t i = 0; i < results->nb_args; ++i)
    //     free(results->arguments[i]);
    if (results->arguments != NULL)
        free(results->arguments);
    if (results->options_values != NULL)
        free(results->options_values);
    free(results);
}
