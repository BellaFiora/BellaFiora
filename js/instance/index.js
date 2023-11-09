const internal = require('stream');
const CommandParser = require('./Modules/CommandParser');
const IdGenerate = require('./Modules/IdGenerate');
const memoryCache = require('memory-cache');

// const map_meta_data = JSON.parse(fs.readFileSync('./Ressources/MapsMetaData.json', 'utf-8'));
// memoryCache.put('maps_', map_meta_data);

const commandParser = new CommandParser();
// const ID = new IdGenerate()
const user_command = '!bm --od <5';
const from = 'Puparia';


(async () => {
  const id = "111"
  const result = await commandParser.parseCommand(user_command, from, id);
  if (result.error > 0) {
    console.log('error')
    console.table(result)
  } else {

    console.table(result.filters);

  }
})();

// Errors: 

// 1: SyntaxError
// 2: InternalError
// 3: Command not found
// 4: Ignored
// 5: Invalid Argument
// 6: Invalid Option


// {id, error, message, output, data}




