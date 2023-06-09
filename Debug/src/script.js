import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import gsap from "gsap";

// Debug
const gui = new dat.GUI({ width: 340 });
// add color picker
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
  },
};

// install dat.gui or lil-gui via npm
// npm install dat.gui

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
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: parameters.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Debug parameters
gui.add(mesh.position, "x").min(-3).max(3).step(0.01).name("elevation");
gui.add(material, "wireframe").name("wireframe");

gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
});

gui.add(parameters, "spin");

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
