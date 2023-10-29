const UserDatas = require('../Modules/UserDatas');
const userDatas = new UserDatas();
const ExecTime = require("../Metrics/Modules/ExecTime")
const timer= new ExecTime()

class Bm {
  constructor() {
  }

  async execute(from, inputString, parsedFilters, id) {
    timer.start('Execute Command');
    const Data = await userDatas.get(from);
    timer.stop('Execute Command');
    return { error: `0`, message :`Résultat de la commande`, output: null, filters: parsedFilters, id: id, data: Data};
  }
}

module.exports = Bm;