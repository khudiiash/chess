import * as THREE from 'three';
import {InteractiveComponent} from '@/components/Base';
import { TPosition } from '@/types/TPosition';

import BasePieceModel from './BasePieceModel';
import BasePieceView from './BasePieceView';
import { TBoardMap, TMove, TPiece, TResources } from '@/types';

class BasePiece extends InteractiveComponent {
    [x: string]: any;

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

    reset() {
      this.model.reset();
      this.view.reset();
      this.view.move(this.model.position);
    }

    undo() {
      this.model.undo();
      this.view.setPosition(this.model.state.position);
      if (this.isAlive && this.view.isDead) this.view.revive();
    }
   
    setPosition(position: TPosition) {
      // set position immediately
      this.model.setPosition(position);
      this.view.setPosition(position);
    }

    async move(position: TPosition, instantly = false) {
      // set position with animation
      this.model.setPosition(position, true);
      instantly ? this.view.setPosition(position) : await this.view.move(position);
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

    revive() {
      this.model.revive();
      this.view.revive();
    }

    onClick(): void {

    }

    canMoveTo(map: TBoardMap, {row, col}: TPosition) {
      return this.getMoves(map).some(([, move]: TMove) => move.row === row && move.col === col);
    }

    get position() {
      return this.model.position;
    }

    get team() {
      return this.model.team;
    }

    get type() {
      return this.model.type;
    }

    get value() {
      return this.model.value;
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