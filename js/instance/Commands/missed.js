class Missed {
  constructor(from) {
    this.from = from;
  }

  execute() {
    return { error: `0`, message :`Résultat de la commande`};
  }
}

module.exports = Missed;