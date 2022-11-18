import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams, IPieceViewBuildConfig } from "@/interfaces/Piece";

class King extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new KingModel(params);
    this.view = new KingView(params);
    this.build();
  }

}

class KingModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'king';
  }
}

class KingView extends BasePieceView {
  
    build(config: IPieceViewBuildConfig): void {
      super.build(config);
      this.mesh.rotation.z = 0;
      this.defaultRotation = this.mesh.rotation.clone();
    }
  
}


export default King;