const conf = require('credentials')
const axios = require('axios')
const os = require('os')
class remoteSrv {


    async Login(){
        return new Promise(async (e, n) => {
            const Conf = new conf()
            const s = "http://176.145.161.240:25586/client/private/login";
            const r = {
                idApp: Conf.getConf("client_id"),
                ipAddress: Conf.getConf('client_ip'),
                version: Conf.getConf('client_version'),
                user_id: Conf.getConf('user_id'),
                osu_token: Conf.getConf('osu_token'),
                register_timestamp: Conf.getConf('ts_register'),
                platform: Conf.getConf('platform'),
                arch: Conf.getConf('arch'),
                memory: Conf.getConf('memory'),
                uinfos: Conf.getConf('uinfos'),
                os_release: Conf.getConf('os_release'),
    
            };
            try {
                const a = await axios.get(s, { params: r});
                if (a.data === "done") {
                    e({stat:true})
                } else {
                    e({stat:false, err: a.data})
                }
            } catch (e) {
                console.error("Error when request :", e.message);
                n(e)
            }
        })
    }

    async Reg(){
        return new Promise(async (e, n) => {
            const Conf = new conf()
            const s = "abcdefghijklmnopqrstuvwxyz0123456789"
            let o = "";
            for (let e = 0; e < 8; e++) {
                const l = Math.floor(Math.random() * s.length);
                o += s[l]
            }
            const r = "http://176.145.161.240:25586/client/private/register";
            Conf.setConf("client_id", o);
            Conf.setConf('platform', os.platform())
            Conf.setConf('arch', os.arch())
            Conf.setConf('memory', os.totalmem())
            Conf.setConf('uinfos', os.userInfo())
            Conf.setConf('os_release', os.release())

            const i = {
                idApp: Conf.getConf("client_id"),
                ipAddress: Conf.getConf('client_ip'),
                version: Conf.getConf('client_version'),
                user_id: Conf.getConf('user_id'),
                osu_token: Conf.getConf('osu_token'),
                register_timestamp: Conf.getConf('ts_register'),
                platform: Conf.getConf('platform'),
                arch: Conf.getConf('arch'),
                memory: Conf.getConf('memory'),
                uinfos: Conf.getConf('uinfos'),
                os_release: Conf.getConf('os_release'),
            };
            try {
                const c = await axios.get(r, {
                    params: i
                });

                if (c.data === "done") {
                    e({stat:true})
                } else {
                    e({stat:false})
                }
            } catch (e) {
                console.log('err')
                console.log(e)
                n(e)
            }
        })
    }

    async Log(log){
        const Conf = new conf()
        const t = "http://176.145.161.240:25586/client/private/logs";
        const o = {
            idApp: Conf.getConf('client_id'),
            ipAddress: Conf.getConf('client_ip'),
            version: Conf.getConf('client_version'),
            logs: log
        };
        try {
            const r = await axios.get(t, {
                params: o
            })
        } catch (e) {
            console.error(e)
        }
    }

}

module.exports = remoteSrv