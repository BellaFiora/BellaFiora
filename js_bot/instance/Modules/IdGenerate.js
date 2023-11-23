
class IdGenerate {
    constructor() {
    }
    create() {

      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let id = '';
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        id += charset[randomIndex];
      }

      return id;
    }
  }
  
  
  module.exports = IdGenerate;