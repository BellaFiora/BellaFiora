const assert = require('assert');
const ParseFilters = require('../../../Modules/FiltersParser'); 

describe('ParseFilters Class', () => {
    it('should parse input string with valid options and arguments', () => {
        const parser = new ParseFilters();
        const result = parser.parse('--od 9.5 --hp 8 --status ranked', 1);
        assert.strictEqual(result.error, 0, 'No errors expected');
    });

    it('should handle missing arguments for required options', () => {
        const parser = new ParseFilters();
        const result = parser.parse('--od', 1);
        assert.strictEqual(result.error, 5, 'Missing argument error expected for --od');
    });
});