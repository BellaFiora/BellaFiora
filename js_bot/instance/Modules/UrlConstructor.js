const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

class UrlConstructor {
    constructor() {
        // Les initialisations peuvent être ajoutées ici si nécessaire
    }

    async get_user_url(user, type, apiKey, limit = 100, mode = 0) {
        try {
            if (!user || !apiKey || !type) {
                throw new Error('Missing user, apiKey, or type');
            }

            mode = mode !== null ? `&m=${mode}` : "";
            const Url = `https://osu.ppy.sh/api/get_user?k=${apiKey}&u=${user}&type=${type}&limit=${limit}${mode}`;
            console.log(Url)
            return Url;

        } catch (error) {
            throw new Error('Invalid parameters for user URL');
        }
    }
}

module.exports = UrlConstructor; // Exportation de la classe pour l'utilisation dans d'autres fichiers
