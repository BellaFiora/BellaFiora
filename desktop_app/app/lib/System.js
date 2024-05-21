const os = require('os');
const { uptime } = require('process');
class System{
    constructor(){

        this.arch = os.arch()
        this.memory = os.totalmem()
        this.platform = os.platform()
        this.release = os.release()
        this.homedir = os.homedir()
        this.cpus =  os.cpus()
        this.os = os.type()
    }
    SystemInfo(){
        let array = {
            arch : null,
            memory : null,
            platform : null,
            release :null,
            homedir : null,
            cpus : null,
            os: null,
        }
        try {
            array.arch = this.arch
            array.memory = this.memory
            array.platform = this.platform
            array.release = this.release
            array.homedir = this.homedir
            array.cpus = this.cpus
            array.os = this.os
        }
        
        catch(e){
            //implement error managment
        }
        return array
    }

    CurrentInfo(){
        let array = {
            arch : null,
            memory : null,
            platform : null,
            release : null,
            homedir : null,
            cpus : null,
            os : null,
            tempdir : null,
            uptime : null,
            loadAvg : null,
            freemem :null,
        }

        try {
            array.arch = this.arch
            array.memory = this.memory
            array.platform = this.platform
            array.release = this.release
            array.homedir = this.homedir
            array.cpus = this.cpus
            array.os = this.os
            array.tempdir = os.tempdir()
            array.uptime = os.uptime()
            array.loadAvg = os.loadavg()
            array.freemem = os.freemem()
        } catch(e){
            //implement error managment
           
        }

        return array
    }
}

module.exports = System