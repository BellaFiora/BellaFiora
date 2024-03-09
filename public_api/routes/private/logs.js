module.exports = {
    Static: (req) => {
      let query = req.query
      return new Promise(async (resolve, reject) => {
        console.log(`Client ${query.idApp} [LOG : ${query.logs}]`)
        //next 
        resolve('done');
      })
      
    },
};