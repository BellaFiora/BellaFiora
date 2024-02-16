module.exports = {
    handleRequest: (query) => {

      console.log(`Client ${query.idApp} [LOG : ${query.logs}]`)
        
      return 'done';
    },
};