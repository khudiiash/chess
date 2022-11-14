class InteractiveComponent {

  view: any;
  handlers: {
    [key: string]: Function[]
  } = {};
  
  constructor() {

  }

  makeClickable() {
    this.view.mesh.userData.clickable = true;
    this.view.mesh.userData.component = this;
    this.addHandler('click', this.onClick.bind(this));
  }

  select(data: any) {
    console.log('select', data);
  }

  deselect(data: any) {
    console.log('deselect', data);
  }

  onClick() {
    console.log('click');
  }

  onHover() {
    console.log('hover');
  }

  addHandler(event: string, handler: Function) {
    if (event in this.handlers) {
      this.handlers[event].push(handler);
    } else {
      this.handlers[event] = [handler];
    }
  }

  dispatchEvent(event: string, data?: any) {
    if (event in this.handlers) {
      this.handlers[event].forEach((handler: any) => handler(data));
    }
  }

}

export default InteractiveComponent;