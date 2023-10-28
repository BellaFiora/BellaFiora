class ParseFilters {
  constructor() {
    this.options = [
      { 
        prefixAllowed: "--",
        option: "od", 
        format: "float",
        threshold: 0.1, 
        min_value: 0,
        max_value: 10,
        arguments: 1,
        description: "[Argument: 1, Type: Float, Range: 1-10]",
        acceptedArgument: []
      },
      { 
        prefixAllowed: "--",
        option: "hp", 
        format: "float",
        threshold: 0.1, 
        min_value: 0,
        max_value: 10,
        arguments: 1,
        description: "[Argument: 1, Type: Float, Range: 1-10]",
        acceptedArgument: []
      },
      { 
        prefixAllowed: "--",
        option: "cs", 
        format: "float",
        threshold: 0.1, 
        min_value: 0,
        max_value: 10,
        arguments: 1,
        description: "[Argument: 1, Type: Float, Range: 1-10]",
        acceptedArgument: []
      },
      { 
        prefixAllowed: "--",
        option: "ar", 
        format: "float",
        threshold: 0.1, 
        min_value: 0,
        max_value: 10,
        arguments: 1,
        description: "[Argument: 1, Type: Float, Range: 1-10]",
        acceptedArgument: []
      },
      { 
        prefixAllowed: "--",
        option: "sr", 
        format: "float",
        threshold: 0.5, 
        min_value: 0,
        max_value: 10,
        arguments: 1,
        description: "[Argument: 1, Type: Float, Range: 1-10]",
        acceptedArgument: []
      },
      { 
        prefixAllowed: "--",
        option: "pp", 
        format: "float",
        threshold: 10, 
        min_value: 0,
        max_value: 4000,
        arguments: 1,
        description: "[Argument: 1, Type: Int, Range: 0-4000]",
        acceptedArgument: []
      },
      { 
        prefixAllowed: "--",
        option: "bpm", 
        format: "float",
        threshold: 10, 
        min_value: 2,
        max_value: 600,
        arguments: 1,
        description: "[Argument: 1, Type: Int, Range: 2-600]",
        acceptedArgument: []
      },
      { 
        prefixAllowed: "--",
        option: "mapper", 
        format: "string",
        threshold: null,
        min_value: null,
        max_value: null,
        arguments: 1,
        description: '[Argument: 1, Type: String, Format: "pseudo"]',
        acceptedArgument: []
      },
      { 
        prefixAllowed: "--",
        option: "s", 
        format: "string",
        threshold: null, 
        min_value: null,
        max_value: null,
        arguments: 1,
        description: '[Argument: 1, Type: String, Format: "name of save"]',
        acceptedArgument: []
      },
      { 
        prefixAllowed: "--",
        option: "status", 
        format: "string",
        threshold: null, 
        min_value: null,
        max_value: null,
        arguments: 1,
        description: '[Argument: 1, Type: String, Options: ranked, loved, graveyard, wip]',
        acceptedArgument: ["ranked", "loved", "graveyard", "wip"]
      },
      { 
        prefixAllowed: "--",
        option: "help", 
        format: "string",
        threshold: null, 
        min_value: null,
        max_value: null,
        arguments: 0,
        description: "Get a help",
        acceptedArgument: []
      },
    ];
    this.parameterValues = {
      hp_min: 0,
      hp_max:10,
      od_min:0,
      od_max:10,
      cs_min: 0,
      cs_max: 10,
      sr_min: 0,
      sr_max: 30,
      ar_min: 0,
      ar_max: 10,
      pp_min: 0,
      pp_max: 4000,
      bpm_min: 2,
      bpm_max: 600,
      help: false,
      mapper: false,
      status: false,
      s: false,

    };
    this.errors = [];
  }

  parse(inputString) {

    const inputArray = inputString.match(/"[^"]+"|\S+/g);
    let currentOption = null;
    for (let i = 0; i < inputArray.length; i++) {
      const currentToken = inputArray[i];
      if (currentToken.startsWith("--")) {
        const optionName = currentToken.split(" ")[0];
        const option = this.options.find(opt => opt.prefixAllowed + opt.option === optionName);
        if (option) {
          currentOption = option;
          let argument = null;
          const argumentIndex = i + 1;

          if (option.arguments > 0 && argumentIndex < inputArray.length) {
            argument = inputArray[argumentIndex];
            if (option.format === "string" && option.acceptedArgument.length > 0 && !option.acceptedArgument.includes(argument)) {
              this.errors.push({ error: 6, error_name: `Invalid argument for ${option.option}: ${argument}. ${option.description}`  });
              argument = null;
            }
            if(option.format === "string" && option.arguments === 1){
              this.parameterValues[`${option.option}`] = argument
            }
          } else if (option.arguments > 0) {
            this.errors.push({ error: 3, error_name: `Missing argument for ${option.option}. ${option.description}` });
          } else {
            this.parameterValues[`${option.option}`] = true
          }

          if (option.format === "float") {
            argument = parseFloat(argument);
          }

          if (option.min_value !== null && option.max_value !== null) {
            if (argument < option.min_value || argument > option.max_value) {
              this.errors.push({ error: 4, error_name: `Value for ${option.option} is out of range [${option.min_value}, ${option.max_value}]. ${option.description}` });
            } else {
              this.parameterValues[`${option.option}_min`] = (argument - option.threshold).toFixed(1);
              this.parameterValues[`${option.option}_max`] = (argument + option.threshold).toFixed(1);
            }
          }
          i = argumentIndex;
        } else {
          this.errors.push({ error: 2, error_name: `Invalid option: ${optionName}` });
        }
      } 
    }
    const result = { parameterValues: this.parameterValues, errors: this.errors };
    console.table(result)
    return result
  }
}
  
module.exports = ParseFilters;