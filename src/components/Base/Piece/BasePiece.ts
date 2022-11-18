import * as THREE from 'three';
import {InteractiveComponent} from '@/components/Base';
import { outOfBoard } from '@/utils/math';
import { TPosition } from '@/types/TPosition';

import BasePieceModel from './BasePieceModel';
import BasePieceView from './BasePieceView';
import { Cell } from '@/components/Cell';
import { TResources } from '@/types';

class BasePiece extends InteractiveComponent {

    value: number;
    color: number;
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    model: BasePieceModel;
    view: BasePieceView;
    validMoves: TPosition[];
    resources: TResources;

    build() {
      this.view.build({
        size: this.model.size,
        color: this.model.color,
        team: this.model.team,
        type: this.model.type
      });
      this.view.setPosition(this.position);
      this.makeClickable();
    }

    setValidMoves(moves: TPosition[]) {
      this.model.validMoves = moves;
    }
    
    getValidMoves() {
      return this.model.validMoves;
    }

    reset() {
      this.model.reset();
      this.view.reset();
      this.view.setPosition(this.position);
    }
   
    setPosition(position: TPosition) {
      // set position immediately
      this.model.setPosition(position);
      this.view.setPosition(position);
    }

    move(position: TPosition, instantly = false) {
      // set position with animation
      this.model.setPosition(position);
      this.model.setHasMoved(true);
      instantly ? this.view.setPosition(position) : this.view.move(position);
    }

    select() {
      this.model.selected = true;
    }

    deselect() {
      this.model.selected = false;
    }

    kill(instantly = false) {
      this.model.kill();
      this.view.kill(instantly);
    }

    onClick(): void {

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
        
        if (['knight', 'pawn', 'king'].includes(this.model.type) && !(this.isPawn && !this.hasMoved)) {
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

    canMoveTo({row, col}: TPosition) {
      return this.model.validMoves.some(move => move.row === row && move.col === col);
    }

    get position() {
      return this.model.position;
    }

    get team() {
      return this.model.team;
    }

    get isKing() {
      return this.model.type === 'king';
    }
    get isQueen() {
      return this.model.type === 'queen';
    }
    get isRook() {
      return this.model.type === 'rook';
    }
    get isBishop() {
      return this.model.type === 'bishop';
    }
    get isKnight() {
      return this.model.type === 'knight';
    }
    get isPawn() {
      return this.model.type === 'pawn';
    }
    get isWhite() {
      return this.model.team === 'white';
    }
    get isBlack() {
      return this.model.team === 'black';
    }

    get hasMoved() {
      return this.model.hasMoved;
    }
    get isAlive() {
      return this.model.isAlive;
    }
    get isDead() {
      return this.model.isDead;
    }


}


export default BasePiece;