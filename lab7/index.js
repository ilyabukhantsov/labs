// task7.js
const { EventEmitter } = require("events");
const { Subject } = require("rxjs");

// ---------- EventEmitter version ----------
class EventBus extends EventEmitter {
  emitMessage(event, payload) {
    this.emit(event, payload);
  }

  subscribe(event, listener) {
    this.on(event, listener);
  }

  unsubscribe(event, listener) {
    this.off(event, listener);
  }
}

class Sensor {
  constructor(name, eventBus) {
    this.name = name;
    this.eventBus = eventBus;
  }

  send(data) {
    console.log(`[${this.name}] sending:`, data);
    this.eventBus.emitMessage("data", { from: this.name, data });
  }
}

class Logger {
  constructor(name, eventBus) {
    this.name = name;
    this.eventBus = eventBus;
    this.listener = this.handle.bind(this);
  }

  handle(payload) {
    console.log(`[${this.name}] received from ${payload.from}:`, payload.data);
  }

  subscribe() {
    this.eventBus.subscribe("data", this.listener);
  }

  unsubscribe() {
    this.eventBus.unsubscribe("data", this.listener);
  }
}

// ---------- RxJS Observable version ----------
class ObservableBus {
  constructor() {
    this.subject = new Subject();
  }

  emit(message) {
    this.subject.next(message);
  }

  subscribe(name) {
    return this.subject.subscribe((msg) => {
      console.log(`[${name}] received via Observable:`, msg);
    });
  }
}

// ---------- Demo ----------
console.log("--- Using EventEmitter ---");
const eventBus = new EventBus();
const sensorA = new Sensor("SensorA", eventBus);
const logger1 = new Logger("Logger1", eventBus);
const logger2 = new Logger("Logger2", eventBus);

logger1.subscribe();
logger2.subscribe();

sensorA.send({ temp: 21 });
logger2.unsubscribe();
sensorA.send({ temp: 22 });

console.log("\n--- Using RxJS Observable ---");
const observableBus = new ObservableBus();
const sub1 = observableBus.subscribe("Observer1");
const sub2 = observableBus.subscribe("Observer2");

observableBus.emit({ type: "status", ok: true });
sub2.unsubscribe();
observableBus.emit({ type: "status", ok: false });
