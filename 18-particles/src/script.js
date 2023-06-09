import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// particles
// Geometry - create our own geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 50000;

const positions = new Float32Array(count * 3);
// create random colors
const colorsArray = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colorsArray[i] = Math.random();
}

// set positions
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// set colors
particlesGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colorsArray, 3)
);
// set vertex colors to true in the material

// load particles texture
const particlesTexture = textureLoader.load("/textures/particles/2.png");
// sizeAttenuation: true - particles will be smaller as they get further away from the camera
const particlesMaterial = new THREE.PointsMaterial({
  transparent: true,
  alphaMap: particlesTexture,
  size: 0.02,
  sizeAttenuation: true,
  //   color: "#f8e6cb",
  //   alphaTest: 0.001,
  //   depthTest: false,
  depthWrite: false,
  vertexColors: true,
});

// how to fix particles overlapping
// 1. use depthTest: false
// 2. use depthWrite: false
// 3. use blending: THREE.AdditiveBlending
// 4. use alphaTest: 0.001
// 5. use alphaMap: particlesTexture
// 6. use alphaToCoverage: true
// 7. use alpha: 0.5
// 8. use premultipliedAlpha: true
// 9. use vertexColors: true

// addictive blending
// particlesMaterial.blending = THREE.AdditiveBlending;
// what is addictive blending?
// https://www.youtube.com/watch?v=Q8g9zL-JL8E

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);

// create a box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: "white" });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

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

  // animate particles

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
