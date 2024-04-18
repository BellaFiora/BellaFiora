const UserDatas = require('./dataset')

class Properties extends UserDatas {
    constructor(username){
        super(username);
        this.username = username
    }

    getUser(callback){
        this.db.get("SELECT * FROM users WHERE username = ?", [this.username], (err, row) => {
            if (err) {
                return console.error('Read error: ' + err.message);
            }
            callback(row);
        });
    }
    getUserUD(callback){
        this.db.all("SELECT * FROM users WHERE username = ?", [this.username], (err, rows) => {
            if (err) {
                return console.error('Read error: ' + err.message);
            }
            callback(rows);
        });
    }
}

module.exports = Properties