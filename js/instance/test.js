// const options = [
//     { 
//       prefixAllowed: "--",
//       option: "od", 
//       format: "float",
//       threshold: 0.1, 
//       min_value: 0,
//       max_value: 10,
//       arguments: 1,
//       description: "Adjusts the required accuracy.",
//       acceptedArgument: []
//     },
//     { 
//       prefixAllowed: "--",
//       option: "hp", 
//       format: "float",
//       threshold: 0.1, 
//       min_value: 0,
//       max_value: 10,
//       arguments: 1,
//       description: "Allows to adjust the difficulty of health.",
//       acceptedArgument: []
//     },
//     { 
//       prefixAllowed: "--",
//       option: "cs", 
//       format: "float",
//       threshold: 0.1, 
//       min_value: 0,
//       max_value: 10,
//       arguments: 1,
//       description: "Size of the circles.",
//       acceptedArgument: []
//     },
//     { 
//       prefixAllowed: "--",
//       option: "ar", 
//       format: "float",
//       threshold: 0.1, 
//       min_value: 0,
//       max_value: 10,
//       arguments: 1,
//       description: "Approach rate.",
//       acceptedArgument: []
//     },
//     { 
//       prefixAllowed: "--",
//       option: "mapper", 
//       format: "string",
//       threshold: null,
//       min_value: null,
//       max_value: null,
//       arguments: 1,
//       description: "Give a map of a specific mapper",
//       acceptedArgument: []
//     },
//     { 
//       prefixAllowed: "--",
//       option: "s", 
//       format: "string",
//       threshold: null, 
//       min_value: null,
//       max_value: null,
//       arguments: 1,
//       description: "Save a Current command",
//       acceptedArgument: []
//     },
//     { 
//       prefixAllowed: "--",
//       option: "status", 
//       format: "string",
//       threshold: null, 
//       min_value: null,
//       max_value: null,
//       arguments: 1,
//       description: "Definition of the status of the map to be given",
//       acceptedArgument: ["ranked", "loved", "graveyard", "wip"]
//     },
//   ];
  
//   const inputString = `--od 4.7 --hp 12 --cs 4.5 --status ranked --mapper "sotarks" --s "CollectionPref"`;
//   const inputArray = inputString.split(" ");
//   const parameterValues = {};
//   const errors = [];
//   let currentOption = null;
  
//   for (let i = 0; i < inputArray.length; i++) {
//     const currentToken = inputArray[i];
  
//     if (currentToken.startsWith("--")) {
//       const optionName = currentToken.split(" ")[0];
//       const option = options.find(opt => opt.prefixAllowed + opt.option === optionName);
  
//       if (option) {
//         currentOption = option;
//         let argument = null;
//         const argumentIndex = i + 1;
  
//         if (option.arguments > 0 && argumentIndex < inputArray.length) {
//           argument = inputArray[argumentIndex];
//           if (option.format === "string") {
//             // Check if the argument is enclosed in double quotes and remove them
//             if (argument.startsWith('"') && argument.endsWith('"')) {
//               argument = argument.slice(1, -1);
//             }
//           }
//           if (option.format === "string" && option.acceptedArgument.length > 0 && !option.acceptedArgument.includes(argument)) {
//             errors.push({ error: 6, error_name: `Invalid argument for --${option.option}: ${argument}` });
//             argument = null; // Reset the argument
//           }
//         } else if (option.arguments > 0) {
//           errors.push({ error: 3, error_name: `Missing argument for --${option.option}` });
//         }
  
//         if (option.format === "float") {
//           argument = parseFloat(argument);
//         }
  
//         if (option.min_value !== null && option.max_value !== null) {
//           if (argument < option.min_value || argument > option.max_value) {
//             errors.push({ error: 4, error_name: `Value for --${option.option} is out of range [${option.min_value}, ${option.max_value}]` });
//           } else {
//             parameterValues[option.option] = argument;
//             parameterValues[`${option.option}_min`] = (argument - option.threshold).toFixed(1);
//             parameterValues[`${option.option}_max`] = (argument + option.threshold).toFixed(1);
//           }
//         } else {
//           parameterValues[option.option] = argument;
//         }
  
//         i = argumentIndex;
//       } else {
//         errors.push({ error: 2, error_name: `Invalid option: ${optionName}` });
//       }
//     } else if (currentOption) {
//       if (currentOption.option !== "mapper") {
//         currentOption = null;
//       }
//     }
//   }

//   console.table(parameterValues);
//   console.table(errors);s

require('dotenv').config();
const testt = process.env.ircUsername
console.log(testt)


const Osu = require('./Modules/Requests')
async function test(){
  const osu = new Osu()
  const datas = await osu.getUser("Pupariaa", "string")
  console.table(datas)
}


test()
