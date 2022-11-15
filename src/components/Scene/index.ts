import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Scene {
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderer: THREE.WebGLRenderer;
  private _controls: OrbitControls;

  lights: { ambient: THREE.AmbientLight; directional: THREE.DirectionalLight; };

  build() {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);
    this._controls = new OrbitControls( this._camera, this._renderer.domElement );

    this._camera.position.set(0, 5, 8);
    this._camera.lookAt(0, 0, 0);
    this.setLight();
    this.render();
  }

  setLight() {
    const ambient = new THREE.AmbientLight(0x404040); // soft white light
    const directional = new THREE.DirectionalLight(0xffffff, 1);

    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    directional.castShadow = true;
    directional.shadow.mapSize.width = 1024;
    directional.shadow.mapSize.height = 1024;
    directional.shadow.camera.near = 0;
    directional.shadow.camera.far = 500;
    directional.position.set(5, 10, 5);
    this.lights = { ambient, directional };
    this.add(directional)
    this.add(ambient);
  }

  add(mesh: THREE.Mesh | THREE.Light) {
    this._scene.add(mesh);
  }

  remove(mesh: THREE.Mesh) {  
    this._scene.remove(mesh);
  }

  render() {
    this._renderer.render(this._scene, this._camera);
    this._controls.update();
    requestAnimationFrame(this.render.bind(this));
  }

  onClick(event: MouseEvent) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this._camera);
    const intersects = raycaster.intersectObjects(this.children);
    if (intersects.length > 0) {
      const object = intersects.find((item) => item.object.userData.clickable)?.object;
      if (object) {
        object.userData.component.dispatchEvent('click', object.userData.component);
      }
    }
  }

  get children() {
    return this._scene.children;
  }

  traverse(callback: (child: THREE.Object3D) => void) {
    return this._scene.traverse(callback);
  }

}