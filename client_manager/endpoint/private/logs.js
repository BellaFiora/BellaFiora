module.exports = {
    handleRequest: (query) => {
      return new Promise((resolve, reject) => {
        console.log(`Client ${query.idApp} [LOG : ${query.logs}]`)
        
        resolve('done');
      })
      
    },
};