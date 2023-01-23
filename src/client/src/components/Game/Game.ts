import { Scene, Board, UI, Network, Observer, Engine, Weights } from '@/components';
import Model from './GameModel';
import View from './GameView';
import { events } from '@/../../globals';
import { Difficulty, Mode, Side } from '@/types';
import {boundClass} from 'autobind-decorator'

@boundClass
class Game {

  model: Model;
  view: View;
  scene: Scene;
  board: Board;
  ui: UI;
  engine: Engine;
  network: Network;
  observer: Observer;
  weights: Weights;

  constructor() {
    this.scene = new Scene();
    this.model = new Model();
    this.view = new View();
    this.ui = new UI();
    this.engine = new Engine();
    this.network = new Network();
    this.board = new Board();
    this.weights = new Weights();
    this.observer = new Observer();
    this.setupObservers();
  }

  build() {
    (window as any).game = this;
    this.scene.build(this.onLoad);
    this.ui.build();
  }

  setupObservers() {
    const bindObserver = ([event, callback]: [events, any]) => {
      this.observer.on(event, callback);
    }
    
    Object.entries({
      [events.joinedGame]:            this.onJoinGame,
      [events.guestJoined]:           this.onGuestJoined,
      [events.setUserName]:           this.setUserName,
      [events.setUserSide]:           this.setUserSide,
      [events.gameID]:                this.setGameID,
      [events.mode]:                  this.setMode,
      [events.exit]:                  this.exit,
      [events.difficulty]:            this.setDifficulty,
      [events.checkmate]:             this.onCheckmate,
      [events.pause]:                 () => this.setPlaying(false),
      [events.start]:                 () => this.setPlaying(true),
      [events.resume]:                () => this.setPlaying(true),
    }).forEach(bindObserver);
  }

  onCheckmate() {
    this.setPlaying(false);
    this.clearLocalStorage();
  }

  clearLocalStorage() {
    localStorage.removeItem('state');
    localStorage.removeItem('mode');
  }

  restoreSettings() {
    const mode = localStorage.getItem('mode') as Mode;
    mode && this.setMode(mode);
    const settings = localStorage.getItem('settings');
    if (!settings) return;
    const { side, name } = JSON.parse(settings);
    this.setUserName(name);
    this.setUserSide(side);

    const difficulty = localStorage.getItem('difficulty') as Difficulty;
    difficulty && this.setDifficulty(difficulty);
  }

  setDifficulty(difficulty: Difficulty) {
    this.model.setDifficulty(difficulty);
    this.engine.set_difficulty(difficulty);
    localStorage.setItem('difficulty', difficulty);
  }
  

  pause() {
    this.setPlaying(false);
  }

  resume() {
    this.setPlaying(true);
  }

  exit() {
    this.setPlaying(false);
    this.clearLocalStorage();
  }


  onJoinGame(data: any) {
    const userID = localStorage.getItem('userID');
    this.setGameID(data.gameID);
    this.setMode('online');
    this.network.on(events.move, this.board.onNetworkMove);
    this.setUserSide(data.host.id === userID ? data.host.side : data.guest.side);
  }

  setPlaying(playing: boolean) {
    this.model.setPlaying(playing);
  }

  onGuestJoined(data: any) {
    this.network.on(events.move, this.board.onNetworkMove);
    this.setMode('online');
  }

  setGameID(id: string) {
    this.model.setGameID(id);
  }

  setMode(mode: Mode) {
    this.model.setMode(mode);
    localStorage.setItem('mode', mode);
  }

  setUserName(name: string) {
    this.network.setUserName(name);
    this.model.setUserName(name);
  }

  setUserSide(side: Side) {
    this.model.setUserSide(side);
    this.scene.setUserSide(side);
    this.board.setUserSide(side);
    this.weights.setUserSide(side);
  }

  get playing() {
    return this.model.playing;
  }

  get local() : boolean {
    return this.model.mode === 'local';
  }

  get ai() : boolean {
    return this.model.mode === 'ai';
  }

  get online() : boolean {
    return this.model.mode === 'online';
  }

  get name(): string {
    return this.model.name;
  }

  get id(): string {
    return this.model.id;
  }

  get mode() : Mode {
    return this.model.mode;
  }

  get difficulty() : 'easy' | 'medium' | 'hard' {
    return this.model.difficulty;
  }


  onLoad(resources: any) {
    this.weights.build(resources);
    this.board.build(resources);
    this.scene.add(this.board.view.mesh);
    this.scene.add(this.weights.view.mesh);
    this.scene.startRendering();
    this.network.init();
    this.handleClick();
    this.observer.emit(events.loaded);


   

    if (this.board.model.isRestore) {
      this.setPlaying(true);
      this.observer.emit(events.restore);
    }

    this.restoreSettings();
  }

  start() {
    this.build();
    this.model.setMode(localStorage.getItem('mode') as Mode || '');
  }

  handleClick() {
    document.addEventListener('pointerdown', this.onClick, false );
  }

  fadeMainLight() {
    this.scene.fadeMainLight();
  }

  restoreMainLight() {
    this.scene.restoreMainLight();
  }

  onClick(event: any) {
    this.scene.onClick(event);
  }
}

export default Game;