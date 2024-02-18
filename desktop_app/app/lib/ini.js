const ini = require('ini');
const conf = require('./priv/credentials');
const fs = require('fs');
const path = require('path')
class gini {
	constructor() {
		this.Conf = new conf() this.ini = ini.parse((fs.readFileSync(path.join(
														 this.Conf.getConf('AppPath'), '/config.ini')))
														.toString())
	}

	get(cat, key) {
		return this.ini[cat][key]
	}

	set(cat, key, value) {
		this.ini[cat][key] = value
		fs.writeFileSync(
			path.join(this.Conf.getConf('AppPath'), '/config.ini'),
			ini.stringify(this.ini), 'utf8')
	}
}
module.exports = gini