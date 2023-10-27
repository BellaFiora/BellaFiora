class ParseFilters {
    constructor() {
      this.filters = {
        od: { min: 0, max: 10 },
        hp: { min: 0, max: 10 },
        cs: { min: 0, max: 10 },
        sr: { min: 0, max: 20 },
        mapper: null,
        pp: { min: 0, max: 2000 },
        acc: { min: 0, max: 100 },
        bpm: { min: 0, max: 600 },
        approved: { values: { 'graveyard': -2, 'wip': 0, 'ranked': 1, 'approved': 2, 'loved': 4 } },
      };
    }
    parse(filterString) {
      const filters = {};
      const filterTokens = filterString.split(' ');
      for (const token of filterTokens) {
        const [filterName, filterValue] = token.split(':');
        const filterNameLowerCase = filterName.toLowerCase();
        
        if (filterNameLowerCase in this.filters) {
          if (filterNameLowerCase === 'approved') {
            const filterValueLowerCase = filterValue.toLowerCase();
            if (filterValueLowerCase in this.filters.approved.values) {
              filters[filterNameLowerCase] = this.filters.approved.values[filterValueLowerCase];
            }
          } else if (/^(min|max)?$/.test(filterValue)) {
            filters[filterNameLowerCase] = { min: this.filters[filterNameLowerCase].min, max: this.filters[filterNameLowerCase].max };
          } else {
            const filterParts = filterValue.split('-');
            if (filterParts.length === 2) {
              const min = parseFloat(filterParts[0]);
              const max = parseFloat(filterParts[1]);
              filters[filterNameLowerCase] = { min, max };
            } else {
              filters[filterNameLowerCase] = filterValue;
            }
          }
        }
      }
      return filters;
    }
  }
  
  module.exports = ParseFilters;