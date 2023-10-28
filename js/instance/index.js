const CommandParser = require('./Modules/CommandParser');
const commandParser = new CommandParser();

const user_command = '!bm --cs 5 ';
const from = 'Puparia';
const result = commandParser.parseCommand(user_command, from);
if (result.error > 0) {
  console.log(result.error);
  console.table(result.message)
} else {
  console.table(result.message)
}



