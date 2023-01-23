import { button, text } from "../elements";
import { boundClass } from "autobind-decorator";
import { Page } from "./page";
import { events } from "@/../../globals";
import gsap from "gsap";

@boundClass
export class OpponentRestartPage extends Page {

  build() {
    super.build();
    gsap.set(`.opponent_restart .button`, {display: 'none' });
  }

    get texts() {
      return {
        request: 'Oppnent is requested to restart the game. Please wait...',
        requested: 'Opponent wants to restart the game...',
        accepted: 'Opponent has agreed to restart. Restarting...',
        refused: 'Opponent has refused to restart...'
      }
    }

    createObservers(): void {
        this.observer.on(events.restartAccepted, this.accepted);
        this.observer.on(events.restartRefused, this.refused);
    }
    get name() {
        return 'opponent_restart';
    }
    get structure() {
        return [
            text(''),
            button('Accept',    this.accept, ['accept', 'requested']),
            button('Refuse',    this.refuse, ['refuse', 'requested']),
            button('Continue',  this.close, ['continue', 'refused']),
            button('Exit',      this.exit, ['exit', 'refused']),
        ];
    }

    request() {
       this.setText(this.texts.request);
       gsap.set('.opponent_restart .button', { display: 'none' })
    }

    requested() {
      this.setText(this.texts.requested);
      gsap.set('.opponent_restart .button', { display: 'none' });
      gsap.set('.opponent_restart .requested', { display: 'block' });
    }

    refused() {
        this.setText(this.texts.refused);
        gsap.set('.opponent_restart .refused', { display: 'block' })
    }

    accepted() {
      this.setText(this.texts.accepted);
      gsap.delayedCall(1, () => this.observer.emit(events.restart));
    }

    setText(text: string) {
      const textElement = this.dom.querySelector('.text') as HTMLElement;
      if (textElement) {
        textElement.innerText = text;
      }
    }

    accept() {
        this.observer.emit(events.restartAccept);
        this.observer.emit(events.restart);
    }

    refuse() {
        this.observer.emit(events.restartRefuse);
        this.observer.emit(events.resume);
    }

    exit() {
      this.observer.emit(events.exit);
      this.observer.emit(events.leave);
      this.goto('main');
    }
}