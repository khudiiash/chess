import { Side, Resources } from "@/types";
import * as THREE from "three";
import { Gyroscope } from "three/examples/jsm/misc/Gyroscope";
import { degToRad } from "three/src/math/MathUtils";
import gsap from "gsap";

class WeightsView {
  resources: Resources;
  glb: any;
  mesh: THREE.Mesh;
  mixer: THREE.AnimationMixer;

  maxMaterial: number = 1 * 8 + 3 * 2 + 5 + 9;
  left: THREE.Object3D<THREE.Event>;
  right: THREE.Object3D<THREE.Event>;
  handle: THREE.Object3D<THREE.Event>;
  MAX_ROTATION: number = degToRad(20);
  blacks: THREE.Group;
  whites: THREE.Group;
  rightWP: THREE.Vector3;
  leftWP: THREE.Vector3;

  build(resources: Resources) {
    this.glb = resources.models.weights;
    this.mesh = this.glb.scene;
    this.mesh.position.z = -7;  
    this.mesh.scale.setScalar(2);

    this.left = this.mesh.getObjectByName("left");
    this.right = this.mesh.getObjectByName("right");
    this.handle = this.mesh.getObjectByName("handle");

    this.rightWP = new THREE.Vector3();
    this.leftWP = new THREE.Vector3();
    
    this.createHandle();
    this.createPieceHolders();
  }

  createHandle() {
    const leftGyroscope = new Gyroscope();
    const rightGyroscope = new Gyroscope();

    leftGyroscope.position.copy(this.left.position);
    rightGyroscope.position.copy(this.right.position);

    leftGyroscope.add(this.left);
    rightGyroscope.add(this.right);

    leftGyroscope.position.y = -0.15;
    rightGyroscope.position.y = -0.15;

    this.handle.add(leftGyroscope);
    this.handle.add(rightGyroscope);
    this.left.position.set(0, 0, 0);
    this.right.position.set(0, 0, 0);
  }

  createPieceHolders() {
    this.whites = new THREE.Group();
    this.blacks = new THREE.Group();
    
    game.scene.add(this.whites);
    game.scene.add(this.blacks);

    game.scene.addToTick(() => {
      this.left.getWorldPosition(this.leftWP);
      this.right.getWorldPosition(this.rightWP);
      this.blacks.position.copy(this.rightWP);
      this.blacks.position.y -= 3.2;
      this.whites.position.copy(this.leftWP);
      this.whites.position.y -= 3.2;
    })
  }

  materialToRotation(material: { white: number, black: number }) {
    const w = material.white;
    const b = material.black;
    const { MAX_ROTATION } = this;

    if (b === 0 && w > b) {
      return -MAX_ROTATION;
    }
    if (w === 0 && b > w) {
      return MAX_ROTATION;
    }
    
    if (w === b) {
      return 0;
    }
    
    if (w > b) {
      return -MAX_ROTATION * (1 - 1 / (w / b));
    }
    
    if (b > w) {
      return MAX_ROTATION * (1 - 1 / (b / w));
    }

    return 0;
  }


  async update(material: { white: number, black: number}, params: any) {
    const rotation = this.materialToRotation(material);
    const isChange = rotation.toFixed(3) !== this.handle.rotation.z.toFixed(3);
    
    if (isChange) {
      gsap.to(this.handle.rotation, { z: rotation, duration: 2, delay: params.instantly ? 0 : 1.2, ease: "elastic.out(1, 0.3)" });
    } else {
      const z = rotation < 0 ? rotation - 0.1 : rotation + 0.1;
      const delay = params.instantly ? 0 : 1.2;
      
      gsap.timeline({ delay })
        .to(this.handle.rotation, { z, duration: 0.5, ease: "back.out(1.7)" })
        .to(this.handle.rotation, { z: rotation, duration: 1, ease: "back.out(1.7)" });
    }
  }

  setSide(side: Side) {
    this.mesh.position.z = side === "white" ? -7 : 7;
  }

  clear() {
    this.blacks.remove(...this.blacks.children)
    this.whites.remove(...this.whites.children)
    this.handle.rotation.set(0, 0, 0);
  }

}

export default WeightsView;