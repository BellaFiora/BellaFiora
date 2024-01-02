class Metrics {
    /**
     * Constructor for Metrics class.
     */
    constructor() {
        // Initialize properties
        this.timers = new Map();
        this.dataTable = [];
        this.currentID = null;
    }
    /**
     * Initialize the Metrics instance.
     * @returns {Metrics} The Metrics instance.
     */
    Init() {
        this.currentID = null;
        console.log(`Metrics initialized.`);
        return this;
    }
    /**
     * Set or get the current ID.
     * @param {string} id - The ID to set.
     * @returns {string} The current ID.
     */
    ID(id) {
        const existingData = this.dataTable.find(entry => entry.ID === id);
        // If ID doesn't exist, create a new entry in dataTable
        if (!existingData) {
        this.dataTable.push({
            ID: id,
            UserID: null,
            TimeSamp: null,
            EndTime: null,
            ParseErrors: null,
            SyntaxErrors: null,
            FilterTimeExec: null,
            GenerateTimeExec: null,
            FetchTimeExec: null,
            FetchErrors: null,
            Aborted: 0,
            Exited: 0,
            Success: 0,
        });
        }
    
        this.currentID = id;
        return id;
    }
    /**
     * Set UserID value.
     * @param {any} data - Data to set.
     * @returns {Metrics} The Metrics instance.
     */
    UserID(data) {
        this.updateAnalytics("UserID", data);
        return this;
    }
    
    /**
     * Set TimeSamp value.
     * @returns {Metrics} The Metrics instance.
     */
    TimeSamp() {
        this.updateAnalytics("TimeSamp", timesamp());
        return this;
    }
    
    /**
     * Set EndTime value.
     * @returns {Metrics} The Metrics instance.
     */
    EndTime() {
        this.updateAnalytics("EndTime", timesamp());
        return this;
    }
    
    /**
     * Increment ParseErrors.
     * @returns {Metrics} The Metrics instance.
     */
    ParseErrors() {
        this.incrementAnalytics("ParseErrors");
        return this;
    }
    
    /**
     * Increment FetchErrors.
     * @returns {Metrics} The Metrics instance.
     */
    FetchErrors() {
        this.incrementAnalytics("FetchErrors");
        return this;
    }
    
    /**
     * Increment SyntaxErrors.
     * @returns {Metrics} The Metrics instance.
     */
    SyntaxErrors() {
        this.incrementAnalytics("SyntaxErrors");
        return this;
    }
    
    /**
     * Set FilterTimeExec value.
     * @param {any} timesamp - Timesamp value to set.
     * @returns {Metrics} The Metrics instance.
     */
    FilterTimeExec(timesamp) {
        this.updateAnalytics("FilterTimeExec", timesamp);
        return this;
    }
    
    /**
     * Set GenerateTimeExec value.
     * @param {any} timesamp - Timesamp value to set.
     * @returns {Metrics} The Metrics instance.
     */
    GenerateTimeExec(timesamp) {
        this.updateAnalytics("GenerateTimeExec", timesamp);
        return this;
    }
    
    /**
     * Set FetchTimeExec value.
     * @param {any} timesamp - Timesamp value to set.
     * @returns {Metrics} The Metrics instance.
     */
    FetchTimeExec(timesamp) {
        this.updateAnalytics("FetchTimeExec", timesamp);
        return this;
    }
    
    /**
     * Set Aborted value.
     * @returns {Metrics} The Metrics instance.
     */
    Aborted() {
        this.updateAnalytics("Aborted", true);
        return this;
    }
    
    /**
     * Set Exited value.
     * @returns {Metrics} The Metrics instance.
     */
    Exited() {
        this.updateAnalytics("Exited", true);
        return this;
    }
    
    /**
     * Set Success value.
     * @returns {Metrics} The Metrics instance.
     */
    Success() {
        this.updateAnalytics("Success", true);
        return this;
    }
    
    /**
     * Update analytics data.
     * @param {string} analyticsType - Type of analytics to update.
     * @param {any} data - Data to set.
     */
    updateAnalytics(analyticsType, data) {
        const entry = this.findEntryByID();
    
        if (entry) {
        entry[analyticsType] = data;
        } else {
        console.log(`ID "${this.currentID}" not found.`);
        }
    }
    
    /**
     * Increment analytics data.
     * @param {string} analyticsType - Type of analytics to increment.
     */
    incrementAnalytics(analyticsType) {
        const entry = this.findEntryByID();
    
        if (entry) {
        entry[analyticsType] = (entry[analyticsType] || 0) + 1;
        } else {
        console.log(`ID "${this.currentID}" not found.`);
        }
    }
    
    /**
     * Get all analytics data.
     * @returns {Array} The analytics data.
     */
    env() {
        return this.dataTable;
    }
    
    /**
     * Start a timer.
     * @param {string} key - Timer key.
     */
    TimerStart(key) {
        if (!this.timers.has(key)) {
        this.timers.set(key, process.hrtime());
        }
    }
    
    /**
     * Stop a timer and return the elapsed time.
     * @param {string} key - Timer key.
     * @returns {string} The elapsed time.
     */
    TimerStop(key) {
        const timer = this.timers.get(key);
    
        if (timer) {
        const [seconds, nanoseconds] = process.hrtime(timer);
        this.timers.delete(key);
        return (seconds * 1000 + nanoseconds / 1e6).toFixed(0);
        }
    }
    
    /**
     * Clear a timer.
     * @param {string} key - Timer key.
     */
    TimerClear(key) {
        this.timers.delete(key);
    }
    
    /**
     * Find entry in dataTable by ID.
     * @returns {object} The entry in dataTable.
     */
    findEntryByID() {
        return this.dataTable.find(entry => entry.ID === this.currentID);
    }
    
    /**
     * Get the current date and time.
     * @returns {string} The formatted date and time.
     */
    getDate() {
        const currentDateUTC = new Date();
        currentDateUTC.setUTCHours(currentDateUTC.getUTCHours() + 2);
        const year = currentDateUTC.getUTCFullYear();
        const month = String(currentDateUTC.getUTCMonth() + 1).padStart(2, '0');
        const day = String(currentDateUTC.getUTCDate()).padStart(2, '0');
        const hours = String(currentDateUTC.getUTCHours()).padStart(2, '0');
        const minutes = String(currentDateUTC.getUTCMinutes()).padStart(2, '0');
        const seconds = String(currentDateUTC.getUTCSeconds()).padStart(2, '0');
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDateTime;
    }
    }
    
    /**
     * Generate timestamp.
     * @returns {string} The formatted timestamp.
     */
    function timesamp() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    }
    
    module.exports = Metrics;
    