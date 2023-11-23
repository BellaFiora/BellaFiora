class Metrics {
  constructor() {
      this.timers = new Map();
      this.dataTable = [];
      this.currentID = null;
  }

  Init() {
      this.currentID = null;
      console.log(`Metrics initialized.`);
      return this;
  }

  ID(id) {
      const existingData = this.dataTable.find(entry => entry.ID === id);
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
          this.currentID = id;
          return id
      } else {
          this.currentID = id;
          return id
      }

  }

  UserID(data) {
      this.updateAnalytics("UserID", data);
      return this;
  }

  TimeSamp() {
      this.updateAnalytics("TimeSamp", timesamp());
      return this;
  }

  EndTime() {
      this.updateAnalytics("EndTime", timesamp());
      return this;
  }

  ParseErrors() {
      this.incrementAnalytics("ParseErrors");
      return this;
  }
  FetchErrors(){
    this.incrementAnalytics("FetchErrors");
      return this;
  }

  SyntaxErrors() {
      this.incrementAnalytics("SyntaxErrors");
      return this;
  }

  FilterTimeExec(timesamp) {
      this.updateAnalytics("FilterTimeExec", timesamp);
      return this;
  }

  GenerateTimeExec(timesamp) {
      this.updateAnalytics("GenerateTimeExec", timesamp);
      return this;
  }

  FetchTimeExec(timesamp) {
      this.updateAnalytics("FetchTimeExec", timesamp);
      return this;
  }

  Aborted() {
      this.updateAnalytics("Aborted", true);
      return this;
  }

  Exited() {
      this.updateAnalytics("Exited", true);
      return this;
  }

  Success() {
      this.updateAnalytics("Success", true);
      return this;
  }

  updateAnalytics(analyticsType, data) {
      const entry = this.findEntryByID();

      if (entry) {
          entry[analyticsType] = data;
      } else {
          console.log(`ID "${this.currentID}" not found.`);
      }
  }

  incrementAnalytics(analyticsType) {
      const entry = this.findEntryByID();

      if (entry) {
          entry[analyticsType] = (entry[analyticsType] || 0) + 1;
      } else {
          console.log(`ID "${this.currentID}" not found.`);
      }
  }

  env() {
      return this.dataTable;
  }

  TimerStart(key) {
      if (!this.timers.has(key)) {
          this.timers.set(key, process.hrtime());
      }
  }

  TimerStop(key) {
      const timer = this.timers.get(key);

      if (timer) {
          const [seconds, nanoseconds] = process.hrtime(timer);
          this.timers.delete(key);
          return (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
      }
  }

  TimerClear(key) {
      this.timers.delete(key);
  }

  findEntryByID() {
      return this.dataTable.find(entry => entry.ID === this.currentID);
  }
}

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