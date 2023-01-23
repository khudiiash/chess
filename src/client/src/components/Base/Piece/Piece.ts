import * as THREE from 'three';
import {InteractiveComponent} from '@/components/Base';

import PieceModel from './PieceModel';
import PieceView from './PieceView';
import { Move, Position, Resources, Square } from '@/types';

class Piece extends InteractiveComponent {

    color: number;
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    model: PieceModel;
    declare view: PieceView;
    validMoves: Position[];
    resources: Resources;
    
    build() {
      this.view.build({
        size: this.model.size,
        color: this.model.color,
        side: this.model.side,
        type: this.model.type,
        char: this.model.char,
      });
      this.view.setPosition(this.position.square);
      this.makeClickable();
    }
   
    setPosition(square: Square) {
      // set position immediately
      this.model.setPosition(square);
      this.view.setPosition(square);
    }

    async move(move: Move, instantly = false) {
      // set position with animation
      this.model.setPosition(move.to);
      instantly ? this.view.setPosition(move.to) : await this.view.move(move.to);
    }

    select() {
      this.model.selected = true;
      this.view.highlight();
    }

    deselect() {
      this.model.selected = false;
      this.view.dehighlight();
    }

    kill(instantly = false) {
      this.model.kill();
      this.view.kill(instantly);
    }

    onClick(): void {}

    get position(): Position {
      return this.model.position;
    }

    get row(): number {
      return this.model.position.row;
    }

    get col(): number {
      return this.model.position.col;
    }

    get square(): string {
      return this.model.square;
    }

    get side(): 'white' | 'black' {
      return this.model.side;
    }

    get type() {
      return this.model.type;
    }

    get char() {
      return this.model.char;
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
      return this.model.side === 'white';
    }
    get isBlack() {
      return this.model.side === 'black';
    }

    get isAlive() {
      return this.model.isAlive;
    }
    get isDead() {
      return this.model.isDead;
    }

}


export default Piece;