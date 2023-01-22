import {InteractiveComponent} from "@/components/Base";
import { Piece, Square } from "@/types";

import View from "./CellView";
import Model from "./CellModel";

class Cell extends InteractiveComponent {
    
    model: Model;
    declare view: View;
    mesh: THREE.Mesh;
 
    constructor(row: number, col: number, resources: any) {
      super();
      this.model = new Model(row, col);
      this.view = new View();
      this.view.build({ x: row, z: col, color: this.model.colors.default, resources});
      this.makeClickable();
    }

    static toSquare(row: number, col: number): Square {
      return `${String.fromCharCode(97 + col)}${row + 1}` as Square;
    }
    
    static fromSquare(square: string) {
      if (/[a-h][1-8]/.test(square) === false) {
        return { row: -1, col: -1 }
      }
      const col = square.charCodeAt(0) - 97;
      const row = parseInt(square[1]) - 1;
      return { row, col };
    }

    get position() {
      return {...this.model.state.position};
    }

    reset() {
      this.model.reset();
      this.view.reset();
    }


    highlight(capture: string) {
      this.model.setHighlighted(true);
      const color = capture ? this.model.colors.attack : this.model.colors.move;
      this.view.highlight(color);
    }

    dehighlight() {
      this.model.setHighlighted(false);
      this.view.dehighlight();
    }

    onClick(): void {

    }

    get square() {
      return this.model.state.position.square;
    }


    get row() {
      return this.model.state.position.row;
    }

    get col() {
      return this.model.state.position.col;
    }

    get isHighlighted() {
      return this.model.state.isHighlighted;
    }

    get isOccupied() {
      return this.model.state.isOccupied;
    }
    

}

export default Cell;