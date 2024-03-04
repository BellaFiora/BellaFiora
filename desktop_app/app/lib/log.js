const fs = require('fs')
const path = require('path')
/**
 * LogFile class for handling log operations.
 *
 * @class
 */

class LogFile {
    /**
     * Constructor for the LogFile class.
     * Initializes log-related methods.
     */
    constructor() {
         /**
         * Writes logs to a file with detailed information.
         *
         * @method
         * @param {string} service - The service associated with the log (e.g., 'background', 'worker', 'renderer').
         * @param {string} log - The log message to be written.
         * @returns {void}
         */

        this.WriteFile = function(service, log){
            if(!fs.existsSync(path.join(app.getAppPath().replace("\\resources\\app.asar"), 'log.log'))){
                fs.writeFileSync(path.join(app.getAppPath().replace("\\resources\\app.asar"), 'log.log'), 'utf-8')
            }
            const stack = this.stackTraceToObject(new Error().stack)
            const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            fs.appendFileSync(path.join(app.getAppPath().replace("\\resources\\app.asar"), 'log.log'), `${date} [${service}]: "${log}" AT ${stack.function} ${stack.file} ${stack.line} ${stack.column}\n`, 'utf-8')
        }  
         /**
         * Extracts relevant information from a stack trace.
         *
         * @method
         * @param {string} stack - The stack trace string.
         * @returns {Object} - An object containing error details from the stack trace.
         */

        this.stackTraceToObject= function (stack) {
            const lines = stack.split('\n').slice(1);
            const stackObject = {
                error: {
                    message: 'Error',
                    stack: lines.map((line) => {
                        const match = line.trim().match(/at (.+?) \((.+?):(\d+):(\d+)\)/) ||
                                  line.trim().match(/at (.+?) (.+?):(\d+):(\d+)/) ||
                                  line.trim().match(/at (.+?):(\d+):(\d+)/);
                        if (match) {
                            const [, func, file, line, column] = match;
                            return {
                                function: func,
                                file: file,
                                line: parseInt(line),
                                column: (typeof(column) === "number") ? parseInt(column) : -1
                            };
                        } else {
                            return null;
                        }
                    }).filter((entry) => entry !== null)
                }
            };
        
            return stackObject.error.stack[2]
          }
    }
    /**
     * Logs background-related messages.
     *
     * @method
     * @param {string} log - The log message to be written for the background.
     * @returns {void}
     */
    background(log) {
        try {
            this.WriteFile('background', log)
        } catch(e){
            console.error(e);
        }
    }
    /**
     * Logs worker-related messages.
     *
     * @method
     * @param {string} log - The log message to be written for the worker.
     * @returns {void}
     */
    worker(log){
        try {
            this.WriteFile('worker', log)
        } catch(e){
            console.error(e);
        }
    }
     /**
     * Logs renderer-related messages.
     *
     * @method
     * @param {string} log - The log message to be written for the renderer.
     * @returns {void}
     */
    renderer(log){
        try {
            this.WriteFile('renderer', log)
        } catch(e){
            console.error(e);
        }
    }
}
// Create an instance of the LogFile class and export it
const logFile = new LogFile()
module.exports = {logFile}