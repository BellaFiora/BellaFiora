const { NetAnchor } = require('./NetAnchor')
const netAnchor = new NetAnchor()
class Provider {
    async BellaFiora(){
        return await netAnchor.request('https://providers.bellafiora.fr/get/providers/bellafiora/services');
    }
    async OsuApiV1(){
        return await netAnchor.request('https://providers.bellafiora.fr/get/providers/osu/api/v1');
    }
    async OsuApiV2(){
        return await netAnchor.request('https://providers.bellafiora.fr/get/providers/osu/api/v2');
    }
    async Ipify(){
        return await netAnchor.request('https://providers.bellafiora.fr/get/providers/ipify/api64');
    }
}

module.exports = Provider
