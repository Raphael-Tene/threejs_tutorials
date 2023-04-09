import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */

// creating a triangle
// create a float32 array of 3 vertices
// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);

// // create position attribute
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

// create a buffer geometry
const geometry = new THREE.BufferGeometry();

// create a variable with value 50
const count = 50;
// create Float32Array with 3 * 50 = 150 values
const positionsArray = new Float32Array(count * 3 * 3);

// loop through the array and set the values
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 4;
}

// create position attribute
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// set the position attribute to the geometry
geometry.setAttribute("position", positionsAttribute);

// // set the position attribute to the geometry
// geometry.setAttribute("position", positionsAttribute);

// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */

const sizes = {
  // width: 800,
  // height: 600
  width: window.innerWidth,
  height: window.innerHeight,
};

// event listener for resizing
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  // get device pixel ratio and fix pixelation
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// listener for fullscreen
window.addEventListener("dblclick", () => {
  // @ts-ignore
  const fullscreenElement =
    // @ts-ignore
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    // @ts-ignore
    if (canvas.requestFullscreen) {
      // @ts-ignore
      canvas.requestFullscreen();
      // @ts-ignore
    } else if (canvas.webkitRequestFullscreen) {
      // @ts-ignore
      canvas.webkitRequestFullscreen();
    }
  } else {
    // @ts-ignore
    if (document.exitFullscreen) {
      // @ts-ignore
      document.exitFullscreen();
      // @ts-ignore
    } else if (document.webkitExitFullscreen) {
      // @ts-ignore
      document.webkitExitFullscreen();
    }
  }
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
  // @ts-ignore
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
