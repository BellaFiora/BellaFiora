const assert = require('assert');
const Requests = require('../../Modules/Requests'); 

describe('Request as Osu Class', () => {
    it('should fetch user data by username', async () => {
        const osu = new Requests();
        const userData = await osu.getUser('Puparuaa');
        assert(userData, 'User data fetched successfully');
    });

    it('should fetch user data by user ID', async () => {
        const osu = new Requests();
        const userData = await osu.getUser(5146531);
        assert(userData, 'User data fetched successfully');
    });

    it('should throw an error if user is not specified', async () => {
        const osu = new Requests();
        try {
            await osu.getUser();
        } catch (error) {
            assert.strictEqual(error.message, 'Please specify a user');
        }
    });

    it('should throw an error for invalid base data', async () => {
        const osu = new Requests();
        try {
            await osu.getUser('5g4ezg5ez34gez4g');
        } catch (error) {
            assert.strictEqual(error.message, 'Invalid base data');
        }
    });
});