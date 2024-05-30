const axios = require('axios');
const conf = require('./priv/credentials');
const system = require('./System');
const Gv2 = require('./priv/Gv2');

/**
 * Base class providing network communication setup.
 */
class NetAnchor {
    constructor(isTest = false) {
        this.isTest = isTest
        this.bellafiora_ns1 = "http://api.bellafiora.fr";
        this.bellafiora_ns2 = "http://api.bellafiora.fr";
       
        this.osu_api_v1_ns1 = "https://osu.ppy.sh/api/";
        this.osu_api_v1_ns2 = "http://176.129.52.85:65784/api/";
        this.maxAttempts = 1;
        !isTest ? this.conf = new conf() : null
        this.Gv2 = new Gv2();
        this.System = new system();
        this.header = { 
            'X-Device-Info': JSON.stringify(this.System.SystemInfo().os),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': `BellaFioraDesktop/${this.isTest ? 'FG48N4Z' : this.conf.getConf('client_version')} (compatible; MSIE 6.0; Windows NT 5.1)`,
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Content-Security-Policy': "default-src 'self'"
        };
    }

    /**
     * Generic request function to perform HTTP GET requests.
     * @param {string} url - The URL to which the request is sent.
     * @param {Object} options - The configuration options for the request including headers and parameters.
     * @returns {Promise<Object>} The response from the server.
     */
    async request(url, options) {
        try {
            const response = await axios.post(url, { 
                params: options.params, 
                headers: options.headers 
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
    
}
/**
 * Login class for handling login procedures.
 */
class Login extends NetAnchor {
    constructor(isTest) {
        super(isTest);
        this.route = "/client/private/login";
    }

    /**
     * Tries to log in by sending requests to predefined server URLs.
     * @returns {Promise<Object>} Result object indicating success or failure.
     */
    async try() {
        return new Promise(async (resolve, reject) => {
            const servers = [`${this.bellafiora_ns1}${this.route}`, `${this.bellafiora_ns2}${this.route}`];
            const params = {
                client_id: this.isTest ? 'FG48N4Z' : this.conf.getConf("client_id"),
                client_version:  this.isTest ? '0.1.992' : this.conf.getConf('client_version'),
                ip_address: this.isTest ? '192.168.1.20' : this.conf.getConf('client_ip'),
                osu_token: this.isTest ? 'eYA1B2C3' : this.conf.getConf('osu_token'),
                register_timestamp: this.isTest ? '1716434309' : this.conf.getConf('ts_register'),
                system: this.System.SystemInfo().os,   
                user_id: this.isTest ? '4787712' : this.conf.getConf('osu_id'),
                private_key: this.conf.getConf('private_key'),
                osu_token_refresh: this.conf.getConf('refresh_token')
            };
            this.header['Authorization'] = `Baerer ${this.Gv2.SysCallerToken()}`;
            this.header['X-Signature'] = this.Gv2.Signature(params, this.header['Authorization']).hash;
            this.header['X-Correlation-ID'] = this.Gv2.RequestUUID();
            this.header['X-Timestamp'] = (new Date().getTime()).toString();
            this.header['X-Client-ID'] = this.isTest ? 'FG48N4Z' : this.conf.getConf("client_id");
            const options = {
                params: this.Gv2.Signature(params, this.header['Authorization']).params,
                headers: this.header
            };
            for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
                let serverIndex = (attempt - 1) % 2;
                try {
                    const response = await this.request(servers[serverIndex], options);
                    resolve(response);   
                } catch (error) {
                    if (attempt === this.maxAttempts) {
                        resolve('server_error');   
                    }
                }
            }
        })
    }
}
class Update extends NetAnchor {
    constructor(isTest) {
        super(isTest);
        this.route = "/client/private/update";
    }

    /**
     * Tries to log in by sending requests to predefined server URLs.
     * @returns {Promise<Object>} Result object indicating success or failure.
     */
    async try() {
        return new Promise(async (resolve, reject) => {
            const servers = [`${this.bellafiora_ns1}${this.route}`, `${this.bellafiora_ns2}${this.route}`];
            const params = {
                client_id: this.isTest ? 'FG48N4Z' : this.conf.getConf("client_id"),
                client_version:  this.isTest ? '0.1.992' : this.conf.getConf('client_version'),
                ip_address: this.isTest ? '192.168.1.20' : this.conf.getConf('client_ip'),
                osu_token: this.isTest ? 'eYA1B2C3' : this.conf.getConf('osu_token'),
                register_timestamp: this.isTest ? '1716434309' : this.conf.getConf('ts_register'),
                system: this.System.SystemInfo().os,   
                user_id: this.isTest ? '4787712' : this.conf.getConf('osu_id'),
                private_key: this.conf.getConf('private_key'),
                osu_token_refresh: this.conf.getConf('refresh_token')
            };
            
            this.header['Authorization'] = `Baerer ${this.Gv2.SysCallerToken()}`;
            this.header['X-Signature'] = this.Gv2.Signature(params, this.header['Authorization']).hash;
            this.header['X-Correlation-ID'] = this.Gv2.RequestUUID();
            this.header['X-Timestamp'] = (new Date().getTime()).toString();
            this.header['X-Client-ID'] = this.isTest ? 'FG48N4Z' : this.conf.getConf("client_id");
            const options = {
                params: this.Gv2.Signature(params, this.header['Authorization']).params,
                headers: this.header
            };
            for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
                let serverIndex = (attempt - 1) % 2;
                try {
                    const response = await this.request(servers[serverIndex], options);
                    resolve(response);   
                } catch (error) {
                    if (attempt === this.maxAttempts) {
                        resolve('server_error');   
                    }
                }
            }
        })
    }
}
class Synchronization extends NetAnchor {
    constructor(isTest) {
        super(isTest);
        this.route = "/client/private/sync";
    }

    /**
     * Tries to log in by sending requests to predefined server URLs.
     * @returns {Promise<Object>} Result object indicating success or failure.
     */
    async try() {
        return new Promise(async (resolve, reject) => {
            const servers = [`${this.bellafiora_ns1}${this.route}`, `${this.bellafiora_ns2}${this.route}`];
            const params = {
                client_id: this.isTest ? 'FG48N4Z' : this.conf.getConf("client_id"),
                client_version:  this.isTest ? '0.1.992' : this.conf.getConf('client_version'),
                ip_address: this.isTest ? '192.168.1.20' : this.conf.getConf('client_ip'),
                osu_token: this.isTest ? 'eYA1B2C3' : this.conf.getConf('osu_token'),
                register_timestamp: this.isTest ? '1716434309' : this.conf.getConf('ts_register'),
                system: this.System.SystemInfo().os,   
                user_id: this.isTest ? '4787712' : this.conf.getConf('osu_id'),
                private_key: this.conf.getConf('private_key'),
                osu_token_refresh: this.conf.getConf('refresh_token')
            };
            this.header['Authorization'] = `Baerer ${this.Gv2.SysCallerToken()}`;
            this.header['X-Signature'] = this.Gv2.Signature(params, this.header['Authorization']).hash;
            this.header['X-Correlation-ID'] = this.Gv2.RequestUUID();
            this.header['X-Timestamp'] = (new Date().getTime()).toString();
            this.header['X-Client-ID'] = this.isTest ? 'FG48N4Z' : this.conf.getConf("client_id");
            const options = {
                params: this.Gv2.Signature(params, this.header['Authorization']).params,
                headers: this.header
            };
            for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
                let serverIndex = (attempt - 1) % 2;
                try {
                    const response = await this.request(servers[serverIndex], options);
                    resolve(response);   
                } catch (error) {
                    if (attempt === this.maxAttempts) {
                        resolve('server_error');   
                    }
                }
            }
        })
    }
}
class Register extends NetAnchor {
    constructor(isTest) {
        super(isTest);
        this.route = "/client/private/register";
    }

    /**
     * Tries to register by sending requests to predefined server URLs with enhanced security headers.
     * @returns {Promise<Object>} Result object indicating success or failure.
     */
    async try() {
        return new Promise(async (resolve, reject) => {
            const servers = [`${this.bellafiora_ns1}${this.route}`, `${this.bellafiora_ns2}${this.route}`];
            const params = {
                client_id: this.isTest ? 'FG48N4Z' : this.conf.getConf("client_id"),
                client_version:  this.isTest ? '0.1.992' : this.conf.getConf('client_version'),
                ip_address: this.isTest ? '192.168.1.20' : this.conf.getConf('client_ip'),
                osu_token: this.isTest ? 'eYA1B2C3' : this.conf.getConf('osu_token'),
                register_timestamp: this.isTest ? '1716434309' : this.conf.getConf('ts_register'),
                system: this.System.SystemInfo().os,   
                user_id: this.isTest ? '4787712' : this.conf.getConf('osu_id'),
            };
            this.header['Authorization'] = `Baerer ${this.Gv2.SysCallerToken()}`;
            this.header['X-Signature'] = this.Gv2.Signature(params, this.header['Authorization']).hash;
            this.header['X-Correlation-ID'] = this.Gv2.RequestUUID();
            this.header['X-Timestamp'] = (new Date().getTime()).toString();
            this.header['X-Client-ID'] = this.isTest ? 'FG48N4Z' : this.conf.getConf("client_id");
            const options = {
                params: this.Gv2.Signature(params,this.header['Authorization']).params,
                headers: this.header
            };
    
            for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
                let serverIndex = (attempt - 1) % 2;
                try {
                    const response = await this.request(servers[serverIndex], options);
                    resolve(response);   
                } catch (error) {
                    if (attempt === this.maxAttempts) {
                        resolve('server_error');   
                    }
                }
            }
        })
       
    }
}
class ServerLog extends NetAnchor {
    constructor(isTest) {
        super(isTest);
        this.route = "/client/private/login";
    }

    /**
     * Sends a log entry to the server.
     * @param {Object} log - The log data to send.
     */
    async send(log) {
        const params = {
            client_id: this.isTest ? 'FG48N4Z' : this.conf.getConf("client_id"),
            client_version:  this.isTest ? '0.1.992' : this.conf.getConf('client_version'),
            ip_address: this.isTest ? '192.168.1.20' : this.conf.getConf('client_ip'),
            osu_token: this.isTest ? 'eYA1B2C3' : this.conf.getConf('osu_token'),
            register_timestamp: this.isTest ? '1716434309' : this.conf.getConf('ts_register'),
            system: this.System.SystemInfo().os,   
            user_id: this.isTest ? '4787712' : this.conf.getConf('osu_id'),
            logs: log
        }
        this.header['Authorization'] = `Baerer ${this.Gv2.SysCallerToken()}`;
        this.header['X-Signature'] = this.Gv2.Signature(params,this.header['Authorization']).hash;
        this.header['X-Correlation-ID'] = this.Gv2.RequestUUID();
        this.header['X-Timestamp'] = (new Date().getTime());
        this.header['X-Client-ID'] = this.isTest ? 'FG48N4Z' : this.conf.getConf("client_id");
        console.log(this.header)

        const options = {
            params: this.Gv2.Signature(params, this.header['Authorization']).params,
            headers: this.header
        };
        
        try {
            const response = await this.request(`${this.bellafiora_ns1}${this.route}`, options);
            console.log(response.status)
        } catch (error) {
            console.error(error.response.status);
        }
    }
}

module.exports = { Login, Register, ServerLog, NetAnchor, Update, Synchronization};
