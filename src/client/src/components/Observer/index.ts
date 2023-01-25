import { events } from "@/../../globals";

interface Observers {
  [key: string]: Function[];
}
class Observer {
  
  private _observers: Observers;
  static _instance: Observer;

  constructor() {
    if (Observer._instance) {
      return Observer._instance;
    }
    Observer._instance = this;
    this._observers = Object.values(events).reduce((a, b: events)=> { a[b] = []; return a }, {} as Observers);
  }
  

  public on(event: events | events[], callback: Function) {
    if (Array.isArray(event)) {
      event.forEach((e) => this.on(e, callback));
      return;
    }
    
    if (!this._observers[event]) {
      this._observers[event] = [];
    }
    this._observers[event].push(callback);
  }

  public unsubscribe(event: string, callback: Function) {
    this._observers[event] = this._observers[event].filter((observer) => observer !== callback);
  }

  public emit(event: string, data?: any) {
    if (!this._observers[event]) return console.warn(`Event ${event} has no observers`);
    this._observers[event].forEach((observer) => observer(data));
  }

}

export {Observer};