const fs = require('fs');
const path = require('path');
const FiltersParser =  require('./FiltersParser');
class CommandParser {
  constructor() {
    this.commands = {};
    this.filtersParser = new FiltersParser();
    this.loadCommands(path.join(__dirname, '..', 'Commands'));
  }
  loadCommands(commandsDirectory) {
    const commandFiles = fs.readdirSync(commandsDirectory);
    for (const commandFile of commandFiles) {
      if (commandFile.endsWith('.js')) {
        const commandName = path.basename(commandFile, '.js');
        const CommandClass = require(path.join(commandsDirectory, commandFile));
        this.commands[commandName] = new CommandClass();
      }
    }
  }
  parseCommand(inputString, from) {
    if (inputString.startsWith('!')) {
      const commandTokens = inputString.split(' ');
      const commandName = commandTokens[0].slice(1); 

      
      if (this.commands.hasOwnProperty(commandName.toLowerCase())) {
        const command = this.commands[commandName];

        const match = inputString.match(/!([A-Za-z]+)\s+(.+)/);
        var parsedFilters = [];
        if (match) {
          const command = match[1]; 
          const argumentsAfterCommand = match[2]; 
          parsedFilters = this.filtersParser.parse(argumentsAfterCommand);
        } else {
          parsedFilters = null;
        }
        return command.execute(from, inputString, parsedFilters);
      } else {
        return { error: `1`, message :`Commande inconnue`};
      }
    } else {
      return { error: `2`, message :`Ignore`};
    }
  }
}

module.exports = CommandParser;
