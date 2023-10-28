class Bm {
  constructor() {
  }

  execute(from, inputString, parsedFilters) {
    if(parsedFilters.errors.length > 1){
      return { error: `2`, message :`Erreur de syntaxe`, output: parsedFilters.errors};
    }
    return { error: `0`, message :`Résultat de la commande`, output: null, filters: parsedFilters};
  }
}

module.exports = Bm;