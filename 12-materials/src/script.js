import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// create texture
const textureLoader = new THREE.TextureLoader();
const sphereTexture = textureLoader.load("/textures/door/sphere.png");
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

// create 3 geometry objects

const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);

// texture minification filter
sphereTexture.minFilter = THREE.NearestFilter;

// create a mesh basic material
// const material = new THREE.MeshBasicMaterial({ map: sphereTexture });
// material methods
// material.wireframe = true; - sets the material to wireframe
// material.transparent = true; - makes the material transparent
// material.alphaMap = doorAlphaTexture; - sets the alpha map
// material.side = THREE.DoubleSide; - sets the material to double sided
//  material opacity - sets the opacity of the material
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// side - let's decide which side of the material is visible
// material.side = THREE.DoubleSide;
// material.side = THREE.BackSide;
// material.side = THREE.FrontSide;

// create mesh normal material
// const material = new THREE.MeshNormalMaterial();
// // mesh normal material has a flat shading effect
// material.flatShading = true;

// create a mesh matcap material
// this material will pick colors from a texture
// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

// create a mesh depth material
const material = new THREE.MeshDepthMaterial();

// create a mesh with the geometry and material
const sphere = new THREE.Mesh(sphereGeometry, material);
const plane = new THREE.Mesh(planeGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material);

sphere.position.x = -1.5;
plane.position.x = 0;
torus.position.x = 1.5;

// Scene
const scene = new THREE.Scene();
scene.add(sphere, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
// @ts-ignore
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  // @ts-ignore
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
  // rotate objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
