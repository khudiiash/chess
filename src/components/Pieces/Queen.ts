import { BasePiece, BasePieceModel, BasePieceView } from "@/components/Base";
import { IPieceConstructorParams } from "@/interfaces/Piece";
import { TBoardMap, TMove, TMovesMap } from "@/types";
import Bishop from "./Bishop";
import Rook from "./Rook";



class Queen extends BasePiece {

  constructor(params: IPieceConstructorParams) {  
    super();
    this.model = new QueenModel(params);
    this.view = new QueenView(params);
    this.build();
  }

  static get values() : number[][] {
    return [
      [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
      [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
      [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
      [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
      [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
      [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
      [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
      [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
    ]
  }

  static getValue(y: number, x: number, isWhite: boolean): number {
    return Queen.values[y][x];
  }

  getMoves(board: TBoardMap): TMove[] {
    return Queen.getMoves(board, this.position.row, this.position.col);
  }

  static getMoves(board: TMovesMap, row: number, col: number): TMove[] {
    return [
      ...Bishop.getMoves(board, row, col),
      ...Rook.getMoves(board, row, col),
    ];
  }

}

class QueenModel extends BasePieceModel {

  constructor(params: IPieceConstructorParams) {
    super(params);
    this.type = 'queen';
  }

}

class QueenView extends BasePieceView {
  
}



export default Queen;