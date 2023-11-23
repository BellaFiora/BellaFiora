const fs = require('fs');
const path = require('path');
const lst = require('../Commands/listening')
const FiltersParser = require('../Modules/FiltersParser')

const listening = new lst();
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
  parseCommand(inputString, from, id, user_id, user_data) {
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
          parsedFilters = this.filtersParser.parse(argumentsAfterCommand, id, user_id);
          const filtersErrors = parsedFilters.errors
          if(!filtersErrors[0].error === 0){
            return {id: id, error: filtersErrors[0].error, message: filtersErrors[0].error_name, output :"Invalid Parameter"};
          }
        } else {
          parsedFilters = null;
        }
        return command.execute(from, inputString, parsedFilters, id, user_id, user_data);
      } else {
        return {id: id, error: `3`, message :`Commande inconnue`};
      }
    } else if(inputString.startsWith(`\x01ACTION`)){      
        const prefix = "is listening to ";
        const startIndex = inputString.indexOf(prefix);
        if (startIndex !== -1) {
            const textAfterListening = inputString.substring(startIndex + prefix.length);
            var regex = /\[([^\]]+)\]/;
            var match = textAfterListening.match(regex);
            if (match && match.length >= 2) {
                const contentWithinBrackets = match[1];
                const regex = /https:\/\/osu\.ppy\.sh\/beatmapsets\/([0-9]+)#\/([0-9]+) (.+)/;
                match = contentWithinBrackets.match(regex);
                if (match && match.length >= 4) {
                  return listening.execute(from,match[1], match[2], id);
                } else {
                  return {id: id,error: `1`, message :`Erreur de parsing`};
                }
            } else {
              return {id: id,error: `1`, message :`Erreur de parsing`};
            }
        } else {
          return {id: id, error: `1`, message :`Erreur de parsing`};
        }  
    } else {
      return {id: id, error: `4`, message :`Ignore`};
    }
  }
}

module.exports = CommandParser;
