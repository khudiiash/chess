import { IComponent } from "@/interfaces";
import View from "./CellView";
import Model from "./CellModel";
import {InteractiveComponent} from "@/components/Base";

class Cell extends InteractiveComponent {
    
    model: Model;
    view: View;
    mesh: THREE.Mesh;
 
    constructor(row: number, col: number) {
      super();
      this.model = new Model(row, col);
      this.view = new View();
      this.view.build({ x: row, z: col, color: this.model.color });
      this.makeClickable();
    }

    get position() {
      return {...this.model.state.position};
    }

    get isHighlighted() {
      return this.model.state.isHighlighted;
    }

    select() {
      this.model.setSelected(true);
      this.view.select();
    }

    deselect() {
      this.model.setSelected(false);
      this.view.deselect();
    }

    highlight() {
      this.model.setHighlighted(true);
      this.view.highlight();
    }

    onClick(): void {
      this.select();
    }

    get row() {
      return this.model.state.position.row;
    }

    get col() {
      return this.model.state.position.col;
    }
    

}

export default Cell;