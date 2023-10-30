const fs = require('fs');
const path = require('path');
const FiltersParser =  require('./FiltersParser');
const ExecTime = require("../Metrics/Modules/ExecTime")
const timer= new ExecTime()

class CommandParser {
  constructor() {
    this.commands = {};
    this.filtersParser = new FiltersParser();
    this.loadCommands(path.join(__dirname, '..', 'Commands'));
  }
  loadCommands(commandsDirectory) {
    timer.start('Load Commands');
    const commandFiles = fs.readdirSync(commandsDirectory);
    for (const commandFile of commandFiles) {
      if (commandFile.endsWith('.js')) {
        const commandName = path.basename(commandFile, '.js');
        const CommandClass = require(path.join(commandsDirectory, commandFile));
        this.commands[commandName] = new CommandClass();
      }
    }
    timer.stop('Load Commands');
  }
  parseCommand(inputString, from, id) {
    timer.start('Parse Command');
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
          parsedFilters = this.filtersParser.parse(argumentsAfterCommand, id);
          const filtersErrors = parsedFilters.errors
          if(filtersErrors.length){
            timer.stop('Parse Command');
            return { error: filtersErrors[0].error, message: filtersErrors[0].error_name, output :"Invalid Parameter", id: id};
          }
        } else {
          parsedFilters = null;
        }
        timer.stop('Parse Command');
        return command.execute(from, inputString, parsedFilters, id);
      } else {
        timer.stop('Parse Command');
        return { error: `1`, message :`Commande inconnue`};
      }
    } else {
      timer.stop('Parse Command');
      return { error: `2`, message :`Ignore`};
    }
  }
}

module.exports = CommandParser;
