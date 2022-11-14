import * as THREE from 'three';
import { TSize } from '@/types/TSize';
import gsap from 'gsap';
import {InteractiveComponent} from '@/components/Base';
import { outOfBoard } from '@/utils/math';
import { TPosition } from '@/types/TPosition';
import { TMovesMap } from '@/types';

class BasePiece extends InteractiveComponent {

    value: number;
    color: number;
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    team: string;
    model: BasePieceModel;
    view: BasePieceView;
   
    setPosition(row: number, col: number) {
      this.model.setPosition(row, col);
      this.view.setPosition(row, col);
    }

    move(row: number = this.row, col: number = this.col) {
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
      const moves = this.moves;
      const updateValue = (value: number, target: number) => {
        if (value === target) return value;
        return value > target ? value - 1 : value + 1;
      }
      const possibleMoves = moves.map(move => {
        const options = [];
        let r = 0;
        let c = 0;
        
        if (Math.abs(move[0]) < 8) {
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

    get moves(): TMovesMap {
      return  [ [1, -1],  [1, 0],  [1, 1],
                [0, -1],           [0, 1],
                [-1, -1], [-1, 0], [-1, 1]];
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


class BasePieceModel {

  value: number;
  name: string;
  size: TSize;
  color: number;
  team: string;
  type: string;

  state: {
    isSelected: boolean;
    isHovered: boolean;
    position: {
      row: number;
      col: number;
    };
  }

  constructor(value: number) {
    this.size = { width: 0.5, height: 0.5, depth: 0.5 };
    this.type = 'base';
    this.value = value;
    this.team = value > 6 ? 'black' : 'white';
    this.color = value > 6 ? 0x333333 : 0xeeeeee;

    this.state = {
      isSelected: false,
      isHovered: false,
      position: {
        row: 0,
        col: 0
      }
    }
  }

  setPosition(row: number, col: number) {
    this.state.position.row = row;
    this.state.position.col = col;
  }

  setSelected(isSelected: boolean) {
    this.state.isSelected = isSelected;
  }

  setHovered(isHovered: boolean) {
    this.state.isHovered = isHovered;
  }

}

class BasePieceView {
 
  mesh: THREE.Mesh;
  size: TSize;
  color: number;

  build({ size, color }: { size: TSize, color: number }) {
    const geometry = new THREE.BoxGeometry( size.width, size.height, size.depth );
    const material = new THREE.MeshStandardMaterial( { color } );
    this.color = color;
    this.size = size;
    const mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    this.mesh = mesh;
  }

  setPosition(row: number, col: number) {
    this.mesh.position.set(row, this.size.height / 2, col);
  }

  move(row: number, col: number) {
    gsap.to(this.mesh.position, {x: row, z: col, duration: 0.5});
  }

  select() {
    // @ts-ignore
    this.mesh.material.color.setHex(0x8888ff);
  }

  deselect() {
    // @ts-ignore
    this.mesh.material.color.setHex(this.color);
  }

}
export { BasePiece, BasePieceModel, BasePieceView };