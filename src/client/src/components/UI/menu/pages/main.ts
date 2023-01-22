import { Page } from "./page";
import { button, text } from "../elements";
import { events } from "@/../../globals";
import {boundClass} from 'autobind-decorator'

@boundClass
export class MainPage extends Page {

  isOnline: boolean = true;

  get name() {
    return 'main';
  }

  get structure() {
    return [
      text('Welcome to Chess!', ['title']),
      text('Choose how you want to play'),
      button('Play vs computer',  () => this.goto('difficulty')),
      button('Play Locally',      () => this.startGameWithMode('local')),
      button('Invite A Friend',   () => this.goto('invite'), ['offline']),
      button('Join A Friend',     () => this.goto('join'), ['offline']),
      button('Settings',          () => this.goto('settings')),
    ]
  }

  createObservers() {
    const bindObservers = ([event, callback]: [events, any]) => this.observer.on(event, callback);
    Object.entries({
      [events.disconnected]:    this.onDisconnected,
      [events.connected]:       this.onConnected,
      [events.joinedGame]:      () => this.startGameWithMode('online'),
      [events.guestJoined]:     () => this.startGameWithMode('online')
    }).forEach(bindObservers);
  }

  onDisconnected() {
    if (!this.isOnline) return;
    this.isOnline = false;
    document.querySelectorAll('.online').forEach(el => {
      el.classList.remove('online'); 
      el.classList.add('offline')
    });
  }

  onConnected() {
    document.querySelectorAll('.offline').forEach(el => {
      el.classList.remove('offline'); 
      el.classList.add('online')
    });
    this.isOnline = true;
  }

}