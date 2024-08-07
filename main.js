import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { gsap } from 'gsap';
import GUI from 'lil-gui';
import { Timer } from 'three/examples/jsm/Addons.js';

/**
 * Scene
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color('#b8bec6');

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader();
const textures = {
  'Matcap 1': textureLoader.load('/static/textures/matcaps/1.png'),
  'Matcap 2': textureLoader.load('/static/textures/matcaps/2.png'),
  'Matcap 3': textureLoader.load('/static/textures/matcaps/3.png'),
  'Matcap 4': textureLoader.load('/static/textures/matcaps/4.png'),
  'Matcap 5': textureLoader.load('/static/textures/matcaps/5.png'),
  'Matcap 6': textureLoader.load('/static/textures/matcaps/6.png'),
  'Matcap 7': textureLoader.load('/static/textures/matcaps/7.png'),
  'Matcap 8': textureLoader.load('/static/textures/matcaps/8.png'),
};

let currentTexture = textures['Matcap 3'];

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 3;

/**
 * Text
 */
const fontLoader = new FontLoader();

const textProps = (font) => ({
  font,
  size: 0.5,
  depth: 0.2,
  curveSegments: 5,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.02,
  bevelOffset: 0,
  bevelSegments: 5,
});

fontLoader.load('/static/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Developer', textProps(font));
  const textGeometry2 = new TextGeometry('Designer', textProps(font));

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: currentTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  const text2 = new THREE.Mesh(textGeometry2, textMaterial);
  text2.position.y = -1;

  textGeometry.computeBoundingBox();
  textGeometry.center();
  textGeometry2.computeBoundingBox();

  // Box geometry
  const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  const material = new THREE.MeshMatcapMaterial({ matcap: currentTexture });

  // Random cubes
  for (let i = 0; i < 330; i++) {
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );

    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    cube.scale.set(scale, scale, scale);

    scene.add(cube);
  }

  scene.add(text, text2);

  /**
   * Update texture function
   */
  function updateTexture(textureKey) {
    const newTexture = textures[textureKey];

    textMaterial.matcap = newTexture;
    material.matcap = newTexture;
  }

  /**
   * GUI
   */
  const gui = new GUI();

  const sceneFolder = gui.addFolder('Scene');
  // Scene background color
  sceneFolder
    .addColor({ color: scene.background.getStyle() }, 'color')
    .onChange((value) => {
      scene.background.setStyle(value);
    });

  // Text texture
  const textureFolder = gui.addFolder('Texture');
  textureFolder
    .add({ texture: 'Matcap 3' }, 'texture', Object.keys(textures))
    .onChange((value) => {
      updateTexture(value);
    });
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('.bg'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

/**
 * Window Resize
 */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

/**
 * Cursor Animation with damping
 */
window.addEventListener('mousemove', (event) => {
  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;

  gsap.to(camera.position, {
    x: x * 3,
    y: y * 3,
    duration: 0.5,
    onUpdate: () => {
      camera.lookAt(scene.position);
    },
  });
});

/**
 * Animation
 */

const timer = new Timer();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = timer.getDelta();

  scene.rotation.y = 0.03 * elapsedTime;

  renderer.render(scene, camera);
}

animate();
