// require('dotenv').config();
// const Client = require('./Modules/irc')

// const ircUsername = process.env.ircUsername
// const ircPassword = process.env.ircPassword
// const client = new Client(ircUsername, ircPassword);
// const MAX_MESSAGES_PER_SECOND = 3;
// const TIME_INTERVAL = 1000;


// const queue = [];
  
//   client.connect().then(() => {
//     client.listen((message) => {
//       const content = message.message;
//       const from = message.user.ircUsername;
//       if (content.startsWith('!') || content.startsWith('\x01ACTION')) {
//         const ts = (Math.floor(new Date().getTime() / 1000))
//         if (checkMessageConstraints(from, ts)) {
//             queue.push({ from, ts });
//             console.table(queue);
//             console.log('traitement')
//         } else {
//             //too many request
//         }
//       }
//     });
//   });


//   function checkMessageConstraints(from, ts) {
//     const currentTime = Math.floor(Date.now() / 1000);
//     const messagesFromSameSender = queue.filter((item) => item.from === from);
//     const recentMessages = messagesFromSameSender.filter(
//       (item) => currentTime - item.ts <= 1
//     );
//     if (recentMessages.length >= MAX_MESSAGES_PER_SECOND) {
//       console.log(`Trop de messages de ${from} en 1 seconde`);
//       return false;
//     }
//     return true;
//   }
  
require('dotenv').config();
const Client = require('./Modules/irc')
const ircUsername = process.env.ircUsername
const ircPassword = process.env.ircPassword
const client = new Client(ircUsername, ircPassword);

client.connect().then(() => {
    client.listen((message) => {
    const content = message.message;
    if(content.startsWith('(')){
        const currentDate = new Date();
        const heures = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const secondes = currentDate.getSeconds();
        const millisecondes = currentDate.getMilliseconds();
        console.log(`User reçois: ${minutes}:${secondes}:${millisecondes}`);
        console.log('---------------------------')
    }

      if(content === "start"){
        const currentDate = new Date();
        const heures = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const secondes = currentDate.getSeconds();
        const millisecondes = currentDate.getMilliseconds();
        console.log(`User envoie: ${minutes}:${secondes}:${millisecondes}`);
        client.send(message, 'h')
      }
     
      
      if(1 === 0){
        
      }
      
    });
  });