const OsuDBReader = require('./Readers')
const Conf = require('./priv/credentials')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto');
const reader = require('./Readers')

class CollectionManager{
    constructor(){
        this.conf = new Conf()
        this.reader = new OsuDBReader
        this.osuDB = path.join(this.conf.getConf('osu_path'), '/osu!.db')
        this.collectionDB = path.join(this.conf.getConf('osu_path'), '/collection.db')
        this.collectionDBTest = path.join(this.conf.getConf('osu_path'), '/collectionTest.db')

        this.reader = new reader()
        
    }

    async getCollections(){
        let collections = await this.reader.readCollectionDB(this.collectionDB, this.osuDB)
        return collections
    }

    async UpdateCollectionDB(currentCollections){
        const resultat = {};
        for (const key in currentCollections) {
          resultat[key] = currentCollections[key].map(item => item.md5);
        }
    
        this.reader.writeCollectionDB(this.collectionDB, resultat, callback => {
            console.log(callback)
        })

    }
}

module.exports = CollectionManager

