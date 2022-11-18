interface ObserverEvents {
  [key: string]: CallableFunction[];
}

class Observer {
  
  private _observers: ObserverEvents;
  static _instance: Observer;

  constructor() {
    if (Observer._instance) {
      return Observer._instance;
    }
    Observer._instance = this;
    this._observers = {};
  }

  get events() {
    return {
      restart: 'restart',
      continue: 'continue',
    }
  }

  public subscribe(event: string, callback: Function) {
    if (!this._observers[event]) {
      this._observers[event] = [];
    }
    this._observers[event].push(callback);
  }

  public unsubscribe(event: string, callback: Function) {
    this._observers[event] = this._observers[event].filter((observer) => observer !== callback);
  }

  public emit(event: string, data?: any) {
    if (!(event in this.events)) throw new Error(`Event ${event} does not exist`);
    if (!this._observers[event]) return console.warn(`Event ${event} has no observers`);
    this._observers[event].forEach((observer) => observer(data));
  }

}

export {Observer};