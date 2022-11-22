import * as THREE from 'three';
import { Observer } from '@/components';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js' 
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap';
import pVertex from '@/shaders/particles/vertex.glsl';
import pFragment from '@/shaders/particles/fragment.glsl'

export class Scene {
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderer: THREE.WebGLRenderer;
  private _controls: OrbitControls;


  _uniforms = {
    uTime: { value: 0 },
  };

  lights: { ambient: THREE.AmbientLight; directional: THREE.DirectionalLight; };
  _loadingManager: THREE.LoadingManager;
  _modelLoader: GLTFLoader;
  models: { [key: string]: THREE.Mesh; } = {};
  textures: any;
  isShadowUpdated: boolean;
  observer: Observer;

  build(onLoad: Function) {
    this._loadingManager = new THREE.LoadingManager()
    this._modelLoader = new GLTFLoader(this._loadingManager)
    this._modelLoader.setDRACOLoader(new DRACOLoader().setDecoderPath('/draco/'))
    
    this._loadModels();
    this._loadTextures();
    this._createObservers();

    this._loadingManager.onLoad = () => onLoad({ models: this.models, textures: this.textures });
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
    this._renderer = new THREE.WebGLRenderer({ antialias: true});
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);
    
    this._setupControls();

    this._camera.position.set(0, 5, 8);
    this._camera.lookAt(0, 0, 0);
    this._buildLights();
    this._createParticles();
    window.addEventListener('resize', this._onResize.bind(this));
    this._render();
    
  }
  private _createObservers() {
    this.observer = new Observer();
    const { openMenu, closeMenu } = this.observer.events;
    this.observer.subscribe(openMenu, this._onOpenMenu.bind(this));
    this.observer.subscribe(closeMenu, this._onCloseMenu.bind(this));
  }

  private _onOpenMenu() {
    this._controls.autoRotate = true;
  }

  private _onCloseMenu() {
    this._controls.autoRotate = false;
  }
  private _setupControls() {
    this._controls = new OrbitControls( this._camera, this._renderer.domElement );
    this._controls.enableDamping = true;
    this._controls.dampingFactor = 0.1;
    this._controls.maxDistance = 20;
    this._controls.autoRotateSpeed = 0.5;
    this._controls.enablePan = false;
  }

  private _loadModels() {
    const models = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
    models.forEach((name) => {
      this._modelLoader.load(`/models/${name}.glb`, (model) => this._onModelLoaded(name, model));
    });
  }

  private _loadTextures() {
    const loader = new THREE.TextureLoader(this._loadingManager);
    
    this.textures = {
      marble: { ao: null, diffuse: null, roughness: null, metalness: null, normal: null },
      fine_wood: { ao: null, diffuse: null, normal: null, roughness: null, height: null },
    };

    const types = ['displacement', 'normal', 'specular', 'ao', 'diffuse', 'height', 'roughness', 'metalness'];
    const materials = ['fine_wood', 'marble'];
    materials.forEach((material) => {
      types.forEach((type) => {
        if (!(type in this.textures[material])) return;
        const extension = material === 'fine_wood' ? 'jpg' : 'png';
        this.textures[material][type] = loader.load(`/textures/${material}/${material}_${type}.${extension}`, () => {}, (e)=>console.warn(e));
      });
    });
   
  }

  private _onModelLoaded(name: string, model: any) {
    const mesh =  model.scene.children[0];
    mesh.scale.setScalar(1.6);
    this.models[name] = mesh;
  }

  private _buildLights() {
    const ambient = new THREE.AmbientLight(0x404040, 2); // soft white light
    const directional = new THREE.DirectionalLight(0xffffff, 1);

    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    directional.castShadow = true;
    directional.shadow.mapSize.width = 2048;
    directional.shadow.mapSize.height = 2048;
    directional.shadow.camera.near = 0;
    directional.shadow.camera.far = 500;
    directional.position.set(2, 8, -5);
    this.lights = { ambient, directional };
    this.add(directional)
    this.add(ambient);
  }

  add(mesh: THREE.Mesh | THREE.Light | THREE.Points) {
    this._scene.add(mesh);
  }

  fadeMainLight() {
    gsap.to(this.lights.directional, { intensity: 0.5, duration: 0.5 });
    gsap.to(this.lights.ambient, { intensity: 1, duration: 0.5 });

  }

  restoreMainLight() {
    gsap.to(this.lights.directional, { intensity: 1, duration: 0.5 });
    gsap.to(this.lights.ambient, { intensity: 2, duration: 0.5 });
  }

  remove(mesh: THREE.Mesh) {  
    this._scene.remove(mesh);
  }

  private _render() {
    this._renderer.render(this._scene, this._camera);
    
    this._controls.update();
    this._uniforms.uTime.value = -window.performance.now() * 0.0004;
    requestAnimationFrame(this._render.bind(this));
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

  _createParticles() {
    const n = 2000;
    const pGeometry = new THREE.BufferGeometry()
    const pPositions = new Float32Array(n * 3)
    const pTargets = new Float32Array(n * 3)

    const aScales =  new Float32Array(n)
    for (let i = 0; i < n * 3; i ++) {
        pPositions[i] = (Math.random() - 0.5) * 50,
        pTargets[i] = (Math.random() - 0.5) * 50,
        aScales[i] = Math.random() + 0.5 * 10;
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
    pGeometry.setAttribute('aScale', new THREE.BufferAttribute(aScales, 1))
    pGeometry.setAttribute('aTarget', new THREE.BufferAttribute(pTargets, 3))


    const pMaterial = new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: false,
        vertexShader: pVertex,
        fragmentShader: pFragment,
        uniforms: {
            ...this._uniforms,
            uSize: {value: 1000},
        }
    })


    const particles = new THREE.Points(pGeometry, pMaterial)
    particles.name = 'particles'
    this.add(particles)
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