import { IView } from "@/interfaces";
import * as THREE from "three";

class CellView implements IView {

  mesh: THREE.Mesh;
  defaultColor: number;

  build(config: any) {
    this.defaultColor = config.color;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.1, 0.95),
      new THREE.MeshStandardMaterial({ 
        color: config.color,
        normalMap:  config.resources.textures.fine_wood.normal,
        aoMap: config.resources.textures.fine_wood.ao,
        map:  config.resources.textures.fine_wood.diffuse,
        metalness: 0.1,
        roughness: 0.4
      })
    );
    this.mesh.receiveShadow = true;
    this.mesh.position.set(config.x, 0, config.z);
  }

  select() { }

  deselect() { }

  reset() {
    this.dehighlight();
  }

  highlight(color: number) {
    // @ts-ignore
    this.mesh.material.color.setHex(0xdddddd);
    // @ts-ignore
    this.mesh.material.emissive.set(color);
    // @ts-ignore
    this.mesh.material.emissiveIntensity = 1;
  }

  dehighlight() {
    // @ts-ignore
    this.mesh.material.color.setHex(this.defaultColor);
    // @ts-ignore
    this.mesh.material.emissiveIntensity = 0;
  }
}

export default CellView;