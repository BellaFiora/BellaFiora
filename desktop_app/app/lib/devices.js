const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')


class Serial {
    constructor(){

    }

    async getDevices(){
        const ports = await SerialPort.list();
        return ports
    }

    async getInformations(com){
        new Promise((resolve, reject) => {
            try {
                let device = new SerialPort({ path: com, baudRate: 9600 })
                try {
                    device.write('identify\n', (err) => {
                        if (err) {
                            // return console.log('Cannot send to device: ', err.message)
                            resolve(0)

                        }
                        const parser = device.pipe(new ReadlineParser({ delimiter: '\r\n' }))
                        parser.on('data', data => {
                            if (data.includes('Identify:')) {
                                resolve(data);  // Résoudre avec les données si elles correspondent au critère
                            }
                        });
                    });
                } catch(e){
                    resolve(0)
    
                }
    
            } catch(e){
                // console.error(e)
                resolve(0)

            }
        })
       
    }
    setProperties(com, name, value){

    }
}

module.exports = Serial