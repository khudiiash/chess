import { Piece, PieceModel, PieceView } from "@/components/Base";
import { IPieceConstructorParams, IPieceViewBuildConfig } from "@/interfaces/Piece";

class King extends Piece {

  declare model: KingModel;
  declare view: KingView;

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new KingModel(params);
    this.view = new KingView(params);
    this.build();
  }

  check() {
    this.model.isChecked = true;
    this.view.check();
  }

  uncheck() {
    this.model.isChecked = false;
    this.view.uncheck();
  }

  get checked() {
    return this.model.isChecked;
  }

}

class KingModel extends PieceModel {

  isChecked: boolean;

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'king';
    this.isChecked = false;
  }

  get char() {
    return this.side === 'white' ? 'K' : 'k';
  }

}

class KingView extends PieceView {
    isChecked: boolean;
    
    build(config: IPieceViewBuildConfig): void {
      super.build(config);
      this.mesh.rotation.z = 0;
      this.defaultRotation = this.mesh.rotation.clone();
    }

    check() {
      // @ts-ignore
      this.mesh.material.color.setHex(this.colors.checked);
      this.isChecked = true;
    }

    uncheck() {
      if (!this.isChecked) return;
      this.isChecked = false;
      this.dehighlight();
    }
    
    dehighlight() {
      if (this.isChecked) {
        // @ts-ignore
        this.mesh.material.color.setHex(this.colors.checked);
        return;
      }
      super.dehighlight();
    }
  
}


export default King;