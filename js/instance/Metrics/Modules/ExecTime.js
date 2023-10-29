class ExecTime {
    constructor() {
      this.timers = new Map();
    }
  
    start(key) {
      if (this.timers.has(key)) {
        console.warn(`Timer '${key}' already started.`);
        return;
      }
      this.timers.set(key, process.hrtime());
    }
  
    stop(key) {
      if (!this.timers.has(key)) {
        console.warn(`Timer '${key}' was not started.`);
        return;
      }
      const [seconds, nanoseconds] = process.hrtime(this.timers.get(key));
      const elapsedTime = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
      console.log(`Timer '${key}' took ${elapsedTime} ms to execute.`);
      this.timers.delete(key);
    }
    clear(key) {
      if (this.timers.has(key)) {
        this.timers.delete(key);
      }
    }
  }
  
  module.exports = ExecTime;
  