class Bm {
  constructor(from, inputString, parsedFilters) {
    this.from = from;
    this.parsedFilters =  parsedFilters
  }

  execute() {
    console.log('parsed filter: '+this.parsedFilters)
    return { error: `0`, message :`Résultat de la commande`, filters: this.parsedFilters};
  }
}

module.exports = Bm;