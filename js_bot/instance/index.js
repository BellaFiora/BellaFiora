const internal = require('stream');
const CommandParser = require('./Modules/CommandParser');
const IdGenerate = require('./Modules/IdGenerate');
const memoryCache = require('memory-cache');
const LocalStorage = require('./Modules/LocalStorage')
const DynamicStorage = require('./Modules/DynamicStorage')
const Requests = require('./Modules/Requests'); 

// const dynamicStorage = new DynamicStorage()
// dynamicStorage.Init()  //Init Dynamic Storage

let binary = 0b0001000010011001011101000100001111100001100111101011
binary = binary.toString(2)
let bitLength = Math.ceil(Math.log2(binary+1));
bitLength = Math.ceil(bitLength /26) * 26


let numericValues = []
for(let i = bitLength; i>=0 ; i -= 26){
  let group = parseInt(binary.substr(i, 26), 2)
  numericValues.push(group)
}
console.log(numericValues)





// const commandParser = new CommandParser();
// const user_command = '!bm --od <5';
// const from = 'Cata Lina';

// (async () => {
//   const handleResult = (result) => {
//     if (result.error > 0) {
//       console.log('error');
//       console.table(result);
//     } else {
//       console.table(result.filters);
//     }
//   };

//   const localStorage = new LocalStorage();
//   const id = "111";
//   let result;
  // localStorage.ifUser(from).then(async (exists)  => {
  //   if(exists){
      // console.log('exist')
      // localStorage.getUser(from).then(async (content) => {
        // result = await commandParser.parseCommand(user_command, from, id, null, null);
        // handleResult(result);
      // });
  //   } else {
  //     console.log('not exist')
  //     const osu = new Requests();
  //     const userData = await osu.getUser(from);
  //     localStorage.addUser(from, userData);
  //     result = await commandParser.parseCommand(user_command, from, id, userData.md.user_id, userData.osu);
  //     handleResult(result);
  //   }
  // });


// })();

// Errors: 

// 1: SyntaxError
// 2: InternalError
// 3: Command not found
// 4: Ignored
// 5: Invalid Argument
// 6: Invalid Option


// {id, error, message, output, data}


// command: bm
// input: 
// output: { }
// error: 


// result.data
// result.errors
// ..
// ..

// Boolean = bite


