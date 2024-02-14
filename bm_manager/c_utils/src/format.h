#ifndef FORMAT_H
#define FORMAT_H

#include <stdlib.h>

/**
 * @struct Option
 * @brief Structure representing an option for command-line argument parsing.
 */
struct Option {
    /** Whether the option takes an argument. */
    int takes_arg;
    /** Array of short option names (starting with '-' in argv). */
    char** shorts;
    /** Array of long option names (starting with '--' in argv). */
    char** longs;
};

/**
 * @brief      Structure representing the results of command-line argument
 * parsing.
 */
struct Results {
    /** array of parsed arguments */
    char** arguments;
    /** size of arguments */
    size_t nb_args;
    /** array of parsed option values, same size as the options array
     * NULL value means no default value, "" the empty string
     * "1" and "0" represent true and false
     * for options that do not take an argument
     */
    char** options_values;
    /**< number of options encountered */
    size_t options_found;
};

/**
 * @brief      Structure representing additional options for parsing
 * command-line arguments.
 */
struct ParseOptions {
    /** Whether to ignore the first element in argv. */
    int ignore_first;
    /** Default results to include. */
    struct Results* default_result;
    /** Whether to include a default help option. */
    int default_help;
    /** Whether to set the help option if no argument and no option provided. */
    int default_help_value;
};

/**
 * @brief      Parses command-line arguments and options.
 *
 * @param      argv           Null terminated array of command-line arguments.
 * @param      options        Array of options.
 * @param      parse_options  Additional parsing options.
 *
 * @return     A pointer to the Results structure containing parsed arguments
 * and options values.
 */
struct Results* parse_command_line_arguments(char** argv, struct Option* options,
                             struct ParseOptions* parse_options);

/**
 * @brief      Frees memory allocated for the Results structure.
 *
 * @param      results  A pointer to the Results structure to be freed.
 */
void free_results(struct Results* results);

#endif /* FORMAT_H */
