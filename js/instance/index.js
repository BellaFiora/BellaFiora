const CommandParser = require('./Modules/CommandParser');
const commandParser = new CommandParser();

const user_command = '!bm --od 8 --hp 7 --cs 4.5 --ar 9 --status ranked --mapper sotarks';
const from = 'Puparia';
const result = commandParser.parseCommand(user_command, from);
if (result.error > 0) {
  console.log(result.error);
  console.table(result.output)
} else {
  console.table(result);
  console.table(result.filters)
}



