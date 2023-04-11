import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

// !refer to threejs documentation for more information
// !Note: lights can cost a lot when it comes to performance - Try to add few lights as possible as you can and use less expensive lights

// use light helpers to position the lights
// list of threejs light helpers
// HemisphereLightHelper
// DirectionalLightHelper
// PointLightHelper
// RectAreaLightHelper
// SpotLightHelper

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
 * Lights
 */

// ! To see the effect of the different lights, you have to comment out the other lights

// Ambient light - omnidirectional light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);

// create a directional light
const directionalLight = new THREE.DirectionalLight("#F8D49B", 0.5);
// you can set positions to change the direction of the light
directionalLight.position.set(1, 0.25, 1);
//  add light to scene
scene.add(directionalLight);

// create a hemisphere light
const hemisphereLight = new THREE.HemisphereLight("#9a9cea", "#75bde0", 0.3);
// add light to scene
scene.add(hemisphereLight);

// create a point light - a light that emits light in all directions
const pointLight = new THREE.PointLight("#028174", 0.5);
// set the position of the light
pointLight.position.set(1, -0.5, 1);
// add light to scene
scene.add(pointLight);

// create a rect area light
// this light is similar to a point light, but it emits light in a specific direction and only works with MeshStandardMaterial and MeshPhysicalMaterial
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
// change the position of the light
rectAreaLight.position.set(-1.5, 0, 1.5);
// look at the light
rectAreaLight.lookAt(new THREE.Vector3());
// add light to scene
scene.add(rectAreaLight);

// create a spot light
const spotLight = new THREE.SpotLight(
  "#78ff00",
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
// set the position of the light
spotLight.position.set(0, 2, 3);
// set the target of the light
spotLight.target.position.x = -0.75;
// add target to scene
scene.add(spotLight.target);
// add light to scene
scene.add(spotLight);

// light helpers
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//   hemisphereLight,
//   0.2
// );
// // Add helper to the scene
// scene.add(hemisphereLightHelper);

// // directional light helper
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   0.2
// );
// scene.add(directionalLightHelper);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
