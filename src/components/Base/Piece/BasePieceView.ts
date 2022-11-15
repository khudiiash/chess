import { TSize } from "@/types";
import * as THREE from "three";
import gsap from 'gsap';

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

export default BasePieceView;