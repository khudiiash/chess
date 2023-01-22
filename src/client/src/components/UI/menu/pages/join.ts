import { Page } from "./page";
import { button, text, input } from "../elements";
import { events } from "@/../../globals";
import {boundClass} from 'autobind-decorator'

@boundClass
export class JoinPage extends Page {

    code: string;

    build() {
      super.build();
      this.addBackButton();
    }
    
    get name() {
      return 'join';
    }

    get parent() {
      return 'main';
    }

    get structure() {
      return [
        text(`Enter the your friend's code`),
        input('Enter the code', this.writeCode.bind(this), ['code']),
        button('Confirm', this.confirmCode.bind(this)),
      ]
    }

    writeCode(code: string) {
      this.code = code;
    }

    confirmCode() {
      const text = this.dom.querySelector('.text') as HTMLElement;
      if (this.code.length !== 36) {
        text.innerText = 'Code is invalid';
        return;
      }

      this.observer.emit(events.join, this.code);
    }

}