import { IModel } from "@/interfaces";

class GameModel implements IModel {

  moves: { [key: string]: any } = {};
  
  constructor() {
  }

}

export default GameModel;