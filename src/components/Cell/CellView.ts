import { IView } from "@/interfaces";
import * as THREE from "three";

class CellView implements IView {

  mesh: THREE.Mesh;
  color: number;

  build(config: any) {
    this.color = config.color;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.99, 0.1, 0.99),
      new THREE.MeshStandardMaterial({ color: config.color })
    );

    this.mesh.position.set(config.x, 0, config.z);
  }

  select() {
    // @ts-ignore
    this.mesh.material.color.set(0x9999ee);
  }

  deselect() {
    // @ts-ignore
    this.mesh.material.color.set(this.color);
  }

  highlight() {
    // @ts-ignore
    this.mesh.material.color.set(0x99ee99);
  }

  dehighlight() {
    // @ts-ignore
    this.mesh.material.color.set(this.color);
  }
}

export default CellView;