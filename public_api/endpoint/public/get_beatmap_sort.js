const ParamCaretaker = require('../../Modules/ParamCaretaker');

module.exports = {
    handleRequest: (ep, requestData) => {
        const params = new ParamCaretaker();
        const validationError = params.validate(ep, requestData);
        if(requestData.key !== "bAhRTVpaXS4FvEeD9k2KLOI6Ho92MReU" || !requestData.key){
          return {error: 'Unauthorized', status_code: 401}
        }
        if (validationError) {
          return validationError;
        } 
        
      return requestData;
    },
  };