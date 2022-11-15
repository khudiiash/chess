import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";

class King extends BasePiece {

  constructor(value: number) {
    super(value);
    this.model = new KingModel(value);
    this.view = new KingView();
    this.view.build({ size: this.model.size, color: this.model.color, team: this.model.team  });
    this.makeClickable();
  }

}

class KingModel extends BasePieceModel {

  constructor(value: number) {
    super(value);
    this.type = 'king';
    this.size = { width: 0.5, height: 0.8, depth: 0.5 };
  }
}

class KingView extends BasePieceView {
  
    constructor() {
      super();
    }
  
}


export default King;