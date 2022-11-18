import {InteractiveComponent} from "@/components/Base";
import { TPiece } from "@/types";

import View from "./CellView";
import Model from "./CellModel";

class Cell extends InteractiveComponent {
    
    model: Model;
    view: View;
    mesh: THREE.Mesh;
 
    constructor(row: number, col: number, resources: any) {
      super();
      this.model = new Model(row, col);
      this.view = new View();
      this.view.build({ x: row, z: col, color: this.model.colors.default, resources});
      this.makeClickable();
    }

    get position() {
      return {...this.model.state.position};
    }

    reset() {
      this.model.reset();
      this.view.reset();
    }


    highlight() {
      this.model.setHighlighted(true);
      const color = this.isOccupied ? this.model.colors.attack : this.model.colors.move;
      this.view.highlight(color);
    }

    dehighlight() {
      this.model.setHighlighted(false);
      this.view.dehighlight();
    }

    onClick(): void {
      
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