import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
/**
 * Lights
 */
const pointLight = new THREE.PointLight("white", 2);
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.1);
scene.add(pointLightHelper);

/**
 * Object
 */
const geometry = new THREE.SphereGeometry(1, 32, 32);
const textureLoader = new THREE.TextureLoader();

// earth texture
const earthTexture = textureLoader.load("../textures/8k_earth_daymap.jpg");

// moon texture
const moonTexture = textureLoader.load("../textures/8k_moon.jpg");

const material = new THREE.MeshStandardMaterial({
  // color: 0xff0000,
  wireframe: false,
  roughness: 1,
  metalness: 1,
  map: earthTexture,
});

const earth = new THREE.Mesh(geometry, material);
earth.position.y = 1;
scene.add(earth);

const moonGroup = new THREE.Group();

const moonGeo = new THREE.SphereGeometry(1, 10, 10);
const moonMaterial = new THREE.MeshBasicMaterial({
  map: moonTexture,
  roughness: 1,
  metalness: 0,
});
const moon = new THREE.Mesh(moonGeo, moonMaterial);
moon.position.set(1.25, 2, 0);
moon.scale.setScalar(0.25);
// earth.add(moon);
moonGroup.add(moon);
scene.add(moonGroup);

/**
 * Helpers
 */
const gridHelper = new THREE.GridHelper(5);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  earth.rotation.y = elapsedTime * 0.25;
  moonGroup.rotation.y = elapsedTime * 0.25;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
