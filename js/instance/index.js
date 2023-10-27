const CommandParser = require('./Modules/CommandParser');
const commandParser = new CommandParser();

const user_command = '!bm bpm100';
const from = 'Maxime';
const result = commandParser.parseCommand(user_command, from);
if (result.error) {
  console.log(result.error);
} else {
  console.log(result);
}



