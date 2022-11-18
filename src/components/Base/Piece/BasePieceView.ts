import { TPosition, TResources, TSize } from "@/types";
import { IPieceConstructorParams, IPieceViewBuildConfig } from "@/interfaces/Piece";
import * as THREE from "three";
import gsap from 'gsap';

class BasePieceView {
 
  mesh: THREE.Mesh;
  size: TSize;
  color: number;
  team: string;
  model: string;
  resources: TResources;
  defaultRotation: THREE.Euler;
  parent: any;

  constructor({ resources }: IPieceConstructorParams) {
    this.resources = resources;
  }
  
  build({ size, color, team, type }: IPieceViewBuildConfig ) {
    this.team = team;
    this.color = color;
    this.size = size;
    this.mesh = this.resources.models[type].clone();
    this.mesh.castShadow = true;
    this.mesh.rotation.z = Math.PI / 2 * (this.isWhite ? 1 : -1);
    this.defaultRotation = this.mesh.rotation.clone();
    const {normal, ao, diffuse, metalness, roughness} = this.resources.textures.marble;

    this.mesh.material = new THREE.MeshStandardMaterial({ 
      color, 
      transparent: true, 
      normalMap: normal,
      aoMap: ao,
      map: diffuse,
      metalnessMap: metalness,
      roughnessMap: roughness
    });
  }

  setPosition({ row, col}: TPosition) {
    this.mesh.position.set(row, 0, col);
  }

  async move({row, col}: TPosition) {
    return new Promise(resolve => {
      gsap.to(this.mesh.position, {x: row, z: col, onComplete: resolve});
    })
  }

  kill(instantly = false) {
    // @ts-ignore
    this.parent = this.mesh.parent;
    this.mesh.userData.clickable = false;
    const onComplete = () => this.mesh.visible = false;
    const duration = instantly ? 0 : 2;
    const x = this.isWhite ? -4 : 4;
    const z = Math.PI / 2 * (this.isWhite ? 1 : -1);
  
    gsap.to(this.mesh.position, { y: 4, x: `+=${x}`, duration });
    gsap.to(this.mesh.rotation, { z: `+=${z}`, duration });
    gsap.to(this.mesh.material, { opacity: 0, duration, onComplete });
  }

  reset() {
    this.mesh.position.set(0, 0, 0);
    this.mesh.rotation.copy(this.defaultRotation);
    this.mesh.userData.clickable = true;

    // @ts-ignore
    this.mesh.material.opacity = 1;
    this.mesh.visible = true;
  }


  get isWhite(): boolean {
    return this.team === 'white';
  }

  get isBlack(): boolean {
    return this.team === 'black';
  }


}

export default BasePieceView;