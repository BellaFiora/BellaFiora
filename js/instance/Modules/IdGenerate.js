const ExecTime = require("../Metrics/Modules/ExecTime")
const timer= new ExecTime()
class IdGenerate {
    constructor() {
    }
    create() {
      timer.start('IdGenerate');
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let id = '';
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        id += charset[randomIndex];
      }
      timer.stop('IdGenerate');
      return id;
    }
  }
  
  
  module.exports = IdGenerate;