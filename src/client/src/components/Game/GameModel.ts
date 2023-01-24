import { IModel } from "@/interfaces";
import { Difficulty, Mode, Side } from "@/types";

class GameModel implements IModel {

  moves: { [key: string]: any } = {};
  name: string = 'Unknown Player';
  ownGameID: string;
  activeGameID: string;
  mode: Mode;
  sides: {
    user: Side,
    opponent: Side
  }

  playing: boolean = false;
  difficulty: Difficulty;
  settings: { name: string; side: Side; };

  constructor() {
    this.sides = {
      user: 'white',
      opponent: 'black'
    }
    this.settings = {
      name: 'Unknown Player',
      side: 'white',
    }
  }

  setPlaying(playing: boolean) {
    this.playing = playing;
  }

  setDifficulty(difficulty: Difficulty) {
    this.difficulty = difficulty;
  }
  

  swapSides() {
    const { user, opponent } = this.sides;
    this.sides.user = opponent;
    this.sides.opponent = user;
  }

  setUserName(name: string) {
    this.name = name;
    this.settings.name = name;
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  setUserSide(side: Side) {
    this.settings.side = side;
    this.sides.user = side;
    this.sides.opponent = side === 'white' ? 'black' : 'white';
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

  setOwnGameID(id: string) {
    this.ownGameID = id;
  }

  setActiveGameID(id: string) {
    this.activeGameID = id;
  }

  setMode(mode: Mode) {
    this.mode = mode;
  }

}

export default GameModel;