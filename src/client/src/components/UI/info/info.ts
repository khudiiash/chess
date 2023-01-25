import './info.scss';
import { Observer } from '@/components';
import gsap from 'gsap';
import { Side, Piece } from '@/types';
import { events } from '@/../../globals';
import {boundClass} from 'autobind-decorator'

@boundClass
class Info {

  observer: Observer;
  dom: HTMLDivElement;
  whiteMessage: HTMLDivElement;
  blackMessage: HTMLDivElement;
  turnFrame: HTMLDivElement;
  turnMessage: HTMLDivElement;

  constructor() {
    this.observer = new Observer();
    this.dom = document.createElement('div');
    this.dom.classList.add('info');
    
    const bindObserver = ([event, callback]: [events, any]) => {
      this.observer.on(event, callback)
    }
    
    Object.entries({
      [events.turn]:      this.switchTurn,
      [events.move]:      this.onMove,
      [events.check]:     this.onCheck,
      [events.checkmate]: this.onGameOver,
      [events.select]:    this.onSelect,
      [events.exit]:      this.clear,
      [events.restart]:   this.clear
    }).forEach(bindObserver);
  }

  onSelect(piece: Piece) {
    const message = `${piece.type} ${piece.square}`;
    this.showMessage(message, piece.side);
  }

  onCheck(side: Side) {
    this.showMessage('check', side);
  }

  onGameOver({winner}: {winner: Side}) {
    const loser = winner === 'white' ? 'black' : 'white';
    this.showMessage(`${winner} win`, winner);
    this.showMessage(`${loser} lose`, loser);
  }

  
  build() {
   this.whiteMessage = document.createElement('div');
   this.whiteMessage.classList.add('white-message', 'message');

   this.blackMessage = document.createElement('div');
   this.blackMessage.classList.add('black-message', 'message');

   const sidesHeader = document.createElement('div');
    sidesHeader.classList.add('sides-header', 'header');
    sidesHeader.appendChild(this.whiteMessage);
    sidesHeader.appendChild(this.blackMessage);
    this.dom.appendChild(sidesHeader);

   const turnContainer = document.createElement('div');
   turnContainer.classList.add('turn-container', 'header');
   this.dom.appendChild(turnContainer);

   this.turnFrame = document.createElement('div');
   this.turnFrame.classList.add('turn-frame');
   turnContainer.appendChild(this.turnFrame);

   const whiteTurn = document.createElement('div');
   whiteTurn.classList.add('white-turn', 'turn');
   turnContainer.appendChild(whiteTurn);

   const blackTurn = document.createElement('div');
   blackTurn.classList.add('black-turn', 'turn');
   turnContainer.appendChild(blackTurn);

   this.turnMessage = document.createElement('div');
   this.turnMessage.classList.add('turn-message', 'message');
   turnContainer.appendChild(this.turnMessage);
  }

  onMove(moveData: { move: any; capture: any; piece: any; side: any; }) {
    const { move, capture, piece, side } = moveData;
    if (!piece) return;
    const message = `${piece.type} ${move.from}→${move.to} ${capture ? `⊗ ${capture.type}` : ''}`;
    this.showMessage(message, side);
  }

  showMessage(message: string, type: Side | 'turn') {
    let messageElement: HTMLDivElement;
    switch (type) {
      case 'white':
        messageElement = this.whiteMessage;
        break;
      case 'black':
        messageElement = this.blackMessage;
        break;
      case 'turn':
        messageElement = this.turnMessage;
    }

    messageElement.innerText = message;
  }

  switchTurn(turn: Side) {
    const turnFrame = document.querySelector('.turn-frame');
    gsap.to(turnFrame, { duration: 0.25, x: turn === 'white' ? 0 : 60 });
    this.showMessage(`${turn} Turn`, 'turn');
  }

  clear() {
    this.whiteMessage.innerText = '';
    this.blackMessage.innerText = '';
    this.turnMessage.innerText = '';
  }
}

export default Info;