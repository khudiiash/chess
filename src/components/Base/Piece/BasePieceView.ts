import { TSize } from "@/types";
import * as THREE from "three";
import gsap from 'gsap';

class BasePieceView {
 
  mesh: THREE.Mesh;
  size: TSize;
  color: number;
  team: string;

  build({ size, color, team }: { size: TSize, color: number, team: string }) {
    const geometry = new THREE.BoxGeometry( size.width, size.height, size.depth );
    const material = new THREE.MeshStandardMaterial( { color, transparent: true } );
    this.team = team;
    this.color = color;
    this.size = size;
    const mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;
    this.mesh = mesh;
  }

  setPosition(row: number, col: number) {
    this.mesh.position.set(row, this.size.height / 2, col);
  }

  async move(row: number, col: number) {
    return new Promise(resolve => {
      gsap.to(this.mesh.position, {x: row, z: col, duration: 0.5, onComplete: resolve});
    })
  }

  kill() {
    // @ts-ignore
    const onComplete = () => this.mesh.visible = false;
    const duration = 2;
    const x = this.isWhite ? -4 : 4;
    const z = Math.PI / 2 * (this.isWhite ? 1 : -1);
    
    gsap.to(this.mesh.position, { y: 4, x: `+=${x}`, duration });
    gsap.to(this.mesh.rotation, { z: `+=${z}`, duration });
    gsap.to(this.mesh.material, { opacity: 0, duration, onComplete });

  }

  select() {
    // @ts-ignore
    this.mesh.material.color.setHex(0x8888ff);
  }

  deselect() {
    // @ts-ignore
    this.mesh.material.color.setHex(this.color);
  }

  get isWhite(): boolean {
    return this.team === 'white';
  }

  get isBlack(): boolean {
    return this.team === 'black';
  }


}

export default BasePieceView;