const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const ircUpd = require('irc-upd');
const crypto = require('crypto');
const fs = require('fs');
const { ekey } = require('./strict')
class CredentialsDataManager {
    constructor() {
        let e = app.getAppPath();
        e = e.replace("\\resources\\app.asar", "");
        this.filePath = path.join(e, "presence.conf");
        this.encryptionKey = ekey
    }
    encrypt(e, n) {
        const t = crypto.createCipher("aes-256-cbc", n);
        let s = t.update(e, "utf-8", "hex");
        s += t.final("hex");
        return s
    }
    decrypt(e, n) {
        const t = crypto.createDecipher("aes-256-cbc", n);
        let s = t.update(e, "hex", "utf-8");
        s += t.final("utf-8");
        return s
    }
    readCredentialData() {
        try {
            const e = fs.readFileSync(this.filePath, "utf-8");
            const n = this.decrypt(e, this.encryptionKey);
            return JSON.parse(n)
        } catch (e) {
            return {}
        }
    }
    writeCredentialData(e) {
        const n = this.readCredentialData();
        const t = {
            ...n,
            ...e
        };
        const s = this.encrypt(JSON.stringify(t), this.encryptionKey);
        fs.writeFileSync(this.filePath, s, "utf-8")
    }
    setCredentialValue(e, n) {
        const t = this.readCredentialData();
        if (t[e] === undefined) {
            t[e] = n
        } else {
            t[e] = n
        }
        this.writeCredentialData(t)
    }
    getCredentialValue(e) {
        const n = this.readCredentialData();
        if (n[e] === undefined) {
            return false
        } else {
            return n[e]
        }
    }
    deleteCredentialValue(e) {
        const n = this.readCredentialData();
        delete n[e];
        this.writeCredentialData(n)
    }
}
class IRC {
    constructor(e, n) {
        this.serverAddress = "irc.ppy.sh";
        this.serverPort = 6667;
        this.username = e;
        this.password = n
    }
    async connect() {
        return new Promise((n, t) => {
            try {
                var e = new ircUpd.Client("irc.ppy.sh", this.username, {
                    userName: this.username,
                    password: this.password,
                    port: 6667,
                    secure: false,
                    channels: ["#osu"],
                    retryCount: 0
                });
                e.addListener("error", e => {
                    n(false)
                });
                e.addListener("registered", () => {
                    e.disconnect();
                    n(true)
                })
            } catch (e) {
                t(e)
            }
        })
    }
    async sendMessage(e, s) {
        return new Promise((n, t) => {
            this.client.send(e, s, e => {
                if (e) {
                    console.error(e);
                    t(e)
                } else {
                    n("Message sent successfully")
                }
            })
        })
    }
}
module.exports = {
    IRC: IRC,
    CredentialsDataManager: CredentialsDataManager
};