import { Position, Resources, Size } from "@/types";
import { IPieceConstructorParams, IPieceViewBuildConfig } from "@/interfaces/Piece";
import * as THREE from "three";
import gsap from 'gsap';
import { Cell } from "@/components/Cell";

class PieceView {

  mesh: THREE.Mesh;
  size: Size;
  color: number;
  side: string;
  model: string;
  resources: Resources;
  defaultRotation: THREE.Euler;
  parent: any;
  isDead: boolean = false;
  type: string;
  colors: { default: number; active: number; checked: number };
  height: number;
  char: string;

  constructor({ resources }: IPieceConstructorParams) {
    this.resources = resources;
  }
  
  build({ size, color, side, type, char }: IPieceViewBuildConfig ) {
    this.side = side;
    this.color = color;
    this.size = size;
    this.type = type;
    this.char = char;
    this.mesh = this.resources.models[type].clone();
    this.mesh.castShadow = true;
    this.mesh.rotation.z = Math.PI / 2 * (this.isWhite ? 1 : -1);
    this.defaultRotation = this.mesh.rotation.clone();
    const mat = this.resources.textures.white_marble;
    this.height = this.mesh.geometry.boundingBox.max.y - this.mesh.geometry.boundingBox.min.y;

    const rotation = Math.random() * Math.PI * 2;
    const map = mat.diffuse.clone();
    map.encoding = THREE.sRGBEncoding;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(0.5, 0.5);
    map.rotation = rotation;

    this.colors = {
      default: color,
      active: 0x2222ff,
      checked: 0xff0000
    }

    this.mesh.material = new THREE.MeshPhongMaterial({ 
      color: this.colors.default,
      transparent: true, 
      aoMap: map,
      aoMapIntensity: 2.5,
      map: map,
      shininess: 0,
    });
    // @ts-ignore
    this.mesh.userData.defaultEmissiveIntensity = this.mesh.material.emissiveIntensity;
    
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  

  setPosition(square: string) {
    const { row, col } = Cell.fromSquare(square);
    this.mesh.position.set(row, 0, col);
  }

  async move(square: string) {
    const { row, col } = Cell.fromSquare(square);
    return new Promise(resolve => {
      gsap.to(this.mesh.position, {x: row, z: col, onComplete: resolve});
    })
  }

  highlight() {
    // @ts-ignore
    this.mesh.material.color.setHex(this.colors.active);
  }
  
  dehighlight() {
    // @ts-ignore
    this.mesh.material.color.setHex(this.colors.default);
  }

  kill(instantly = false) {
    this.isDead = true;
    this.parent = this.mesh.parent;
    this.mesh.userData.clickable = false;
    
    const deathObject = this.side === 'white' ? game.weights.view.whites : game.weights.view.blacks;
    const deathWP = deathObject.getWorldPosition(new THREE.Vector3());
    const meshWP = this.mesh.getWorldPosition(new THREE.Vector3());
    this.mesh.position.copy(meshWP);
    game.scene.add(this.mesh);
    const target = this.randPos(deathWP);

    const onComplete = () => {
      if (instantly) {
        this.mesh.position.copy(target);
      }

      deathObject.attach(this.mesh);
    }

    if (instantly) {
      game.weights.update(this.char, { instantly });
      return onComplete();
    }


    gsap.timeline({ onComplete })
      .to(this.mesh.position, { x: target.x, y: target.y + 0.5, z: target.z, duration: 0.7, ease: 'power2.out' })
      .to(this.mesh.position, { y: target.y, duration: 0.5, ease: 'power2.in' })
  }


  randPos(pos: THREE.Vector3 = new THREE.Vector3()) {
    const result = new THREE.Vector3(0, 0, 0);
    const random = Math.random() * Math.PI * 2;
    const radius = 0.4;

    result.x = pos.x + Math.cos(random) * radius;
    result.z = pos.z + Math.sin(random) * radius;
    result.y = pos.y;
    return result;
  } 

  vectorsDiff(v1: THREE.Vector3, v2: THREE.Vector3) {
    return new THREE.Vector3(-(v1.x - v2.x), -(v1.y - v2.y), -(v1.z - v2.z));
  }

  revive() {
    this.mesh.visible = true;
    this.mesh.userData.clickable = true;
    this.mesh.position.y = 0;
    this.mesh.rotation.copy(this.defaultRotation);
    // @ts-ignore
    this.mesh.material.opacity = 1;
  }

  reset() {
    this.mesh.position.y = 0;
    this.mesh.rotation.copy(this.defaultRotation);
    this.mesh.userData.clickable = true;
    // @ts-ignore
    this.mesh.material.opacity = 1;
    this.mesh.visible = true;
  }


  get isWhite(): boolean {
    return this.side === 'white';
  }

  get isBlack(): boolean {
    return this.side === 'black';
  }


}

export default PieceView;