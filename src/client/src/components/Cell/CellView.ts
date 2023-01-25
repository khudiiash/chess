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
      color: new THREE.Color(config.color).convertSRGBToLinear(),
      transparent: true,
      opacity: 0.85
    });

    // material.color = material.color.convertSRGBToLinear()


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
    this.mesh.material.color = new THREE.Color(this.defaultColor & color).convertSRGBToLinear();
  }

  dehighlight() {
    // @ts-ignore
    this.mesh.material.color = new THREE.Color(this.defaultColor).convertSRGBToLinear();
  }
}

export default CellView;