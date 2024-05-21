const axios = require('axios');
const conf = require('./priv/credentials');
const system = require('./System');
const Gv2 = require('./priv/Gv2');

/**
 * Base class providing network communication setup.
 */
class NetAnchor {
    constructor() {
        this.bellafiora_ns1 = "http://176.129.52.85:25588/";
        this.bellafiora_ns2 = "http://176.129.52.85:25589/";
        this.osu_api_v1_ns1 = "https://osu.ppy.sh/api/";
        this.osu_api_v1_ns2 = "http://176.129.52.85:65784/api/";
        this.maxAttempts = 7;
        this.conf = new conf();
        this.Gv2 = new Gv2();
        this.System = new system();
        this.header = {
            'X-Device-Info': JSON.stringify(this.System.SystemInfo()),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': `BellaFioraDesktop/${this.conf.getConf('client_version')} (compatible; MSIE 6.0; Windows NT 5.1)`,
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
            const response = await axios.get(url, options);
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
    constructor() {
        super();
        this.route = "/client/private/login";
    }

    /**
     * Tries to log in by sending requests to predefined server URLs.
     * @returns {Promise<Object>} Result object indicating success or failure.
     */
    async try() {
        const servers = [`${this.bellafiora_ns1}${this.route}`, `${this.bellafiora_ns2}${this.route}`];
        const params = {
            system: this.System.SystemInfo(),
            client_id: this.conf.getConf("client_id"),
            ip_address: this.conf.getConf('client_ip'),
            client_version: this.conf.getConf('client_version'),
            user_id: this.conf.getConf('user_id'),
            osu_token: this.conf.getConf('osu_token'),
            register_timestamp: this.conf.getConf('ts_register'),
        };
        this.header['Authorization'] = `Bearer ${this.Gv2.SysCallerToken()}`;
        this.header['X-Signature'] = this.Gv2.Signature(params);
        this.header['X-Correlation-ID'] = this.Gv2.RequestUUID();
        this.header['X-Timestamp'] = new Date().toISOString();
        this.header['Client_ID'] = this.conf.getConf("client_id");
        const options = {
            params: params,
            headers: this.header
        };

        for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
            let serverIndex = (attempt - 1) % 2;
            try {
                const response = await this.request(servers[serverIndex], options);
                if (response.data === "done") {
                    return { stat: true };
                }
                return { stat: false, err: response.data };
            } catch (error) {
                if (attempt === this.maxAttempts) {
                    throw new Error("Max retry attempts reached, last error: " + error.message);
                }
            }
        }
    }
}

/**
 * Register class for handling registration procedures.
 */
class Register extends NetAnchor {
    constructor() {
        super();
        this.route = "/client/private/register";
    }

    /**
     * Tries to register by sending requests to predefined server URLs with enhanced security headers.
     * @returns {Promise<Object>} Result object indicating success or failure.
     */
    async try() {
        const servers = [`${this.bellafiora_ns1}${this.route}`, `${this.bellafiora_ns2}${this.route}`];
        const params = {
            system: this.System.SystemInfo(),
            client_id: this.conf.getConf("client_id"),
            ip_address: this.conf.getConf('client_ip'),
            client_version: this.conf.getConf('client_version'),
            user_id: this.conf.getConf('user_id'),
            osu_token: this.conf.getConf('osu_token'),
            register_timestamp: this.conf.getConf('ts_register'),
        };
        this.header['Authorization'] = `Bearer ${this.Gv2.SysCallerToken()}`;
        this.header['X-Signature'] = this.Gv2.Signature(params);
        this.header['X-Correlation-ID'] = this.Gv2.RequestUUID();
        this.header['X-Timestamp'] = new Date().toISOString();
        this.header['Client_ID'] = this.conf.getConf("client_id");
        const options = {
            params: params,
            headers: this.header
        };

        for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
            let serverIndex = (attempt - 1) % 2;
            try {
                const response = await this.request(servers[serverIndex], options);
                if (response.data === "done") {
                    console.log(`Register successful on attempt ${attempt}`);
                    return { stat: true };
                }
                console.log(`Register attempt ${attempt} returned: ${response.data}`);
                return { stat: false, err: response.data };
            } catch (error) {
                console.error(`Attempt ${attempt}: Error when request`, error.message);
                if (attempt === this.maxAttempts) {
                    throw new Error("Max retry attempts reached, last error: " + error.message);
                }
            }
        }
    }
}

/**
 * Log class for handling system log submissions.
 */
class Log extends NetAnchor {
    constructor() {
        super();
        this.route = "/client/private/logs";
    }

    /**
     * Sends a log entry to the server.
     * @param {Object} log - The log data to send.
     */
    async send(log) {
        this.header['Authorization'] = `Bearer ${this.Gv2.SysCallerToken()}`;
        this.header['X-Signature'] = this.Gv2.Signature(log);
        this.header['X-Correlation-ID'] = this.Gv2.RequestUUID();
        this.header['X-Timestamp'] = new Date().toISOString();
        this.header['Client_ID'] = this.conf.getConf("client_id");
        const options = {
            logs: log,
            headers: this.header
        };

        try {
            const response = await this.request(`${this.bellafiora_ns1}${this.route}`, options);
            console.log('Log submission response:', response.data);
        } catch (error) {
            console.error('Error sending log data:', error);
        }
    }
}

module.exports = { Login, Register, Log };
