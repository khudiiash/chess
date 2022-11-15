import * as THREE from 'three';
import {InteractiveComponent} from '@/components/Base';
import { outOfBoard } from '@/utils/math';
import { TPosition } from '@/types/TPosition';

import BasePieceModel from './BasePieceModel';
import BasePieceView from './BasePieceView';

class BasePiece extends InteractiveComponent {

    value: number;
    color: number;
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    team: string;
    model: BasePieceModel;
    view: BasePieceView;

    constructor(value: number) {
      super();
      this.model = new BasePieceModel(value);
      this.view = new BasePieceView();
    }
   
    setPosition(row: number, col: number) {
      this.model.setPosition(row, col);
      this.view.setPosition(row, col);
    }

    move(row: number = this.row, col: number = this.col) {
      if (!this.model.originalPosition) {
        this.model.setOriginalPosition(row, col);
      }
      this.model.setPosition(row, col);
      this.view.move(row, col);
    }

    select() {
      this.model.setSelected(true);
      this.view.select();
    }

    deselect() {
      this.model.setSelected(false);
      this.view.deselect();
    }

    onClick(): void {
      this.select();
    }

    getPossibleMoves(): TPosition[] | TPosition[][] {
      const { row, col } = this.position;
      const moves = this.model.moves;
      const updateValue = (value: number, target: number) => {
        if (value === target) return value;
        return value > target ? value - 1 : value + 1;
      }
      const possibleMoves = moves.map(move => {
        const options = [];
        let r = 0;
        let c = 0;
        
        if (Math.abs(move[0]) < 8 && Math.abs(move[1]) < 8) {
          r = row + move[0];
          c = col + move[1];
          return outOfBoard(r, c) ? [] : [{row: r, col: c}]
        }

        while (r !== move[0] || c !== move[1]) {
          r = updateValue(r, move[0]);
          c = updateValue(c, move[1]);
          if (outOfBoard(row + r, col + c)) break;
          options.push({row: row + r, col: col + c});
        }   
        return options;
      });
  
      return possibleMoves.filter(move => move.length > 0);
    }

    get position() {
      return {row: this.model.state.position.row, col: this.model.state.position.col};
    }

    get row() {
      return this.model.state.position.row;
    }

    get col() {
      return this.model.state.position.col;
    }

}


export default BasePiece;