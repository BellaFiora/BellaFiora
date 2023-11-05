const CommandParser = require('./Modules/CommandParser');
const IdGenerate = require('./Modules/IdGenerate');
const memoryCache = require('memory-cache');


// const map_meta_data = JSON.parse(fs.readFileSync('./Ressources/MapsMetaData.json', 'utf-8'));
// memoryCache.put('maps_', map_meta_data);

const commandParser = new CommandParser();
const ID = new IdGenerate()
const user_command = '!bm --od >5 ';
const from = 'Puparia';
const id = ID.create()

(async () => {
  const result = await commandParser.parseCommand(user_command, from, id);
  if (result.error > 0) {
    console.log(result.id);
    console.log(result.error);
    console.table(result.message);
  } else {
    console.table(result.data);
  }
})();




