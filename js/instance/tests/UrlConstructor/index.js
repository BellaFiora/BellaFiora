const assert = require('assert');
const UrlConstructor = require('../../Modules/UrlConstructor'); 

describe('UrlConstructor Class', () => {
    it('should construct user URL with required parameters', async () => {
        const urlConstructor = new UrlConstructor();
        const constructedUrl = await urlConstructor.get_user_url('username', 'id', 'API_KEY');
        assert(constructedUrl, 'URL constructed successfully');
    });

    it('should construct user URL with optional parameters', async () => {
        const urlConstructor = new UrlConstructor();
        const constructedUrl = await urlConstructor.get_user_url('username', 'string', 'API_KEY', 50, 0);
        assert(constructedUrl, 'URL constructed successfully');
    });
    it('should throw an error for missing required parameters', async () => {
        const urlConstructor = new UrlConstructor();
        try {
            await urlConstructor.get_user_url('username', 'id');
        } catch (error) {
            assert.strictEqual(error.message, 'Missing user, apiKey, or type');
        }
    });
    it('should throw an error for invalid parameters', async () => {
        const urlConstructor = new UrlConstructor();
        try {
            await urlConstructor.get_user_url();
        } catch (error) {
            assert.strictEqual(error.message, 'Invalid parameters for user URL');
        }
    });
});