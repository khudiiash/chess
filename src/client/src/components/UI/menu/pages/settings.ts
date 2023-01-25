import { Page } from "./page";
import { text, button, input, horizontal } from "../elements";
import '../styles/settings.scss';
import { events } from "@/../../globals";
import { Side } from "@/types";
import {boundClass} from 'autobind-decorator'

@boundClass
export class SettingsPage extends Page {

    username: string = 'Player';
    userside: Side = 'white';
    
    build() {
      super.build();
      this.addBackButton();
      this.restoreSettings();
    }

    get name() {
      return 'settings';
    }

    get structure() {
      return [
        text('Settings', ['title']),
        text('Set your name and preferred side'),
        horizontal([text('Name'), input('Your name', this.writeName)]),
        horizontal([text('Side'), button('',         this.changeSide, ['side-picker', 'white' ])]),
                                  button('Confirm',  this.confirm,    ['confirm']),
      ]
    }

    restoreSettings() {
      const settings = localStorage.getItem('settings');
      if (!settings) return;
      const { name, side } = JSON.parse(settings);

      if (name) this.setName(name);
      if (side) this.setSide(side);
    }


    setName(name: string) {
      const input = this.dom.querySelector('input');
      input.value = name;
      this.username = name;
    }

    writeName(name: string) {
      this.username = name;
    }

    setSide(side: Side) {
      const sidePicker = this.dom.querySelector('.side-picker');
      sidePicker.classList.toggle('black', side === 'black');
      this.userside = side;
    }
    
    changeSide() {
      const sidePicker = document.querySelector('.side-picker');
      sidePicker.classList.toggle('black');
      this.userside = sidePicker.classList.contains('black') ? 'black' : 'white';
    }

    confirm() {
      this.observer.emit(events.setUserName, this.username);
      this.observer.emit(events.setUserSide, this.userside);
      this.goto('main');
    }

  }