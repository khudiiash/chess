import * as THREE from 'three';
import { Game, Observer } from '@/components';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js' 
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap, { normalize } from 'gsap';
import * as dat from 'dat.gui';
import * as Stats from 'stats.js';
import { events } from '@/../../globals';
import {boundClass} from 'autobind-decorator'

@boundClass
export class Scene {
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderer: THREE.WebGLRenderer;
  private _controls: OrbitControls;

  _uniforms = {
    uTime: { value: 0 },
  };

  lights: { ambient: THREE.AmbientLight; point: THREE.PointLight; hemisphere: THREE.HemisphereLight;};
  _loadingManager: THREE.LoadingManager;
  _modelLoader: GLTFLoader;
  models: { [key: string]: THREE.Mesh; } = {};
  matcaps: { [key: string]: THREE.Texture; } = {};
  textures: any;
  isShadowUpdated: boolean;
  observer: Observer;
  gui: any;
  _stats: Stats;
  CLEAR_COLOR: any;
  cameraPositionsBySide: { white: { x: number; y: number; z: number; }; black: { x: number; y: number; z: number; } };
  userSide: string;
  rotator: THREE.Object3D<THREE.Event>;
  mixers: any[];
  clock: THREE.Clock;
  updateList: Function[];

  build(onLoad: Function) {
    this._loadingManager = new THREE.LoadingManager()
    this._modelLoader = new GLTFLoader(this._loadingManager)
    this._modelLoader.setDRACOLoader(new DRACOLoader().setDecoderPath('/draco/'))
    this.CLEAR_COLOR = new THREE.Color(0xe1e1e9);
    this._loadModels();
    this._createObservers();
    this.gui = new dat.GUI();
    this.gui.hide();
    this._stats = new Stats();
    this.userSide= 'white';

    // list of functions that will be called on each frame
    this.updateList = [];

    // document.body.appendChild( this._stats.dom );
    this._stats.dom.style.position = 'fixed';
    this._stats.dom.style.top = '90vh';
    this._stats.dom.style.left = '0';

    this._loadingManager.onLoad = () => onLoad({ models: this.models, textures: this.textures, matcaps: this.matcaps });
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.01, 100);
    this._camera.position.set(0, 15, 15);
    this._camera.lookAt(0, 0, 0);
    this._renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this._renderer.setClearColor(this.CLEAR_COLOR, 1);

    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);

    this.rotator = new THREE.Object3D();
    this.rotator.add(this._camera);
    this.clock = new THREE.Clock();
    this.add(this.rotator);
    this._loadTextures();
    this._createSurrounding();
    this._setupControls();
    this._buildLights();

    this.mixers = [];

    window.addEventListener('resize', this._onResize);

    this.setUserSide('white');
    this._render();
  }

  public startRendering() {
    this.setAllCulled(false);
    this._renderer.render(this._scene, this._camera);
    this.setAllCulled(true);
    this._render();
  }

  addToTick(fn: Function) {
    this.updateList.push(fn);
  }

  each(callback: (object: THREE.Object3D<Event>) => any) {
    this._scene.traverse(callback);
  }

  setAllCulled(culled: boolean) {
    this.each((obj: any) => {
      if (obj.isMesh) {
        obj.frustumCulled = culled;
      }
    });
  }

  private _createSurrounding() {
    const fog = new THREE.Fog(this.CLEAR_COLOR, 30, 40);
    this._scene.fog = fog;
    
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
      }),
    );

    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this.add(plane);
  }

  public setUserSide(side: 'white' | 'black') {
    this.userSide = side;
    // rotate camera around the world center to the right side
    const rotation = side === 'white' ? -Math.PI / 2 : Math.PI / 2;
    gsap.to(this.rotator.rotation, { duration: 2, y: rotation, ease: 'power2.out' });
  }


  private _createObservers() {
    this.observer = new Observer();
    this.observer.on(events.setUserSide, this.setUserSide);
  }


  private _setupControls() {
    this._controls = new OrbitControls( this._camera, this._renderer.domElement );
    this._controls.enableDamping = true;
    this._controls.dampingFactor = 0.1;
    this._controls.maxDistance = 25;
    this._controls.minDistance = 5;
    this._controls.autoRotateSpeed = 0.5;
    this._controls.enablePan = false;
    this._controls.maxPolarAngle = Math.PI / 2.1;
  }

  private _loadModels() {
    console.time('load models')
    const models = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king', 'weights'];
    models.forEach((name) => {
      this._modelLoader.load(`/models/${name}.glb`, (model) => this._onModelLoaded(name, model));
    });
  }

  private _loadTextures() {
    const loader = new THREE.TextureLoader(this._loadingManager);
    
    this.textures = {
      white_marble: {specular: null, height: null, ao: null, diffuse: null, roughness: null, metalness: null, normal: null, emissive: null}
    };

    const types = [ 'diffuse' ];
    const materials = ['white_marble'];
    materials.forEach((material) => {
      types.forEach((type) => {
        if (!(type in this.textures[material])) return;
        const extension = 'jpg';
        this.textures[material][type] = loader.load(`/textures/${material}/${material}_${type}.${extension}`, () => {}, (e)=>console.warn(e));
        this._renderer.initTexture(this.textures[material][type]);
      });
    });
   
  }


  private _onModelLoaded(name: string, model: any) {
    if (name === 'weights') {
      const mesh = model;
      this.models[name] = mesh;
    } else {
      const mesh = model.scene.children[0];
      mesh.scale.setScalar(1.6);
      this.models[name] = mesh;
    }
   
  }

  private _buildLights() {

    // this._renderer.shadowMap.enabled = true;
    // this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this._renderer.physicallyCorrectLights = true;
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    this._renderer.toneMapping = THREE.ACESFilmicToneMapping;


    const lightFolder = this.gui.addFolder('lights')
    const pointFolder = lightFolder.addFolder('point')
    const amblientFolder = lightFolder.addFolder('ambient');
    const hemiFolder = lightFolder.addFolder('hemisphere');



    const ambient = new THREE.AmbientLight(0x404040, 10);
    const point = new THREE.PointLight(0xffffff, 40, 100);
    const hemisphere = new THREE.HemisphereLight(0x0000ff, 0xff0000 , 1);

    pointFolder.add(point.position, 'x', -10, 10, 0.1)
    pointFolder.add(point.position, 'y', -10, 10, 0.1)
    pointFolder.add(point.position, 'z', -10, 10, 0.1)
    pointFolder.add(point, 'intensity', 0, 50, 0.1)

    amblientFolder.add(ambient, 'intensity', 0, 10, 0.1)
    hemiFolder.add(hemisphere, 'intensity', 0, 10, 0.1)


   
    point.position.set(0, 5, 0);
    
    point.userData.defaultIntensity = point.intensity;
    ambient.userData.defaultIntensity = ambient.intensity;

    this.lights = { ambient, point, hemisphere };
    this.add(hemisphere);
    this.add(point)
    this.add(ambient);
  }

  add(mesh: any) {
    this._scene.add(mesh);
  }

  fadeMainLight() {
    const { point, ambient } = this.lights;
    gsap.to(point, { intensity: point.userData.defaultIntensity * 0.5, duration: 0.5 });
    gsap.to(ambient, { intensity: ambient.userData.defaultIntensity * 0.5, duration: 0.5 });

  }

  restoreMainLight() {
    const { point, ambient } = this.lights;
    gsap.to(point, { intensity: point.userData.defaultIntensity, duration: 0.5 });
    gsap.to(ambient, { intensity: ambient.userData.defaultIntensity, duration: 0.5 });
  }

  remove(mesh: THREE.Mesh) {  
    this._scene.remove(mesh);
  }

  private _render() {  
    
    this._renderer.render(this._scene, this._camera);
    this._controls.update(); 
    this._stats.update();
    this.updateList.forEach(fn => fn());
    requestAnimationFrame(this._render);
  }

  onClick(event: MouseEvent) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this._camera);
    const intersects = raycaster.intersectObjects(this.children);

    if (intersects.length > 0 && game.playing) {
      const object = intersects.find((item) => item.object.userData.clickable)?.object;
      if (object) {
        object.userData.component.dispatchEvent('click', object.userData.component);
      }
    }
  }

  private _onResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  get children() {
    return this._scene.children;
  }
}