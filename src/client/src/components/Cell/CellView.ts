import { IView } from "@/interfaces";
import * as THREE from "three";


class CellView implements IView {

  mesh: THREE.Mesh;
  defaultColor: number;
  outline: any;
  static material: THREE.MeshStandardMaterial;
  static geometry: THREE.PlaneGeometry;
  static bMaterial: THREE.MeshStandardMaterial;
  static wMaterial: any;

  async build(config: any) {
    
    if (!CellView.geometry) {
      CellView.geometry = new THREE.PlaneGeometry(1, 1);
    }

    
    this.defaultColor = config.color;
    const material = new THREE.MeshStandardMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.7
    });


    this.mesh = new THREE.Mesh(
      CellView.geometry,
      material
    );
    

    this.mesh.rotateX(-Math.PI / 2);
		
    this.mesh.receiveShadow = true;
    this.mesh.position.set(config.x, 0, config.z);
  }

  render() {}

  select() { }

  deselect() { }

  reset() {
    this.dehighlight();
  }

  highlight(color: number) {
    // @ts-ignore
    this.mesh.material.color.setHex(this.defaultColor & color);
  }

  dehighlight() {
    // @ts-ignore
    this.mesh.material.color.setHex(this.defaultColor);
  }
}

export default CellView;