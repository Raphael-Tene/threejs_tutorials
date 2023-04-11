import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

//  To create shadows, we need to add a light source to our scene. We can do this by creating a directional light. This light source will be positioned at a specific angle and will cast shadows in a specific direction. We can also add an ambient light to our scene. This light source will be positioned at all angles and will cast shadows in all directions. We can also add a point light to our scene. This light source will be positioned at a specific point and will cast shadows in all directions.

// add shadow map to the renderer
// renderer.shadowMap.enabled = true;
// add receive shadow to the object
// object.receiveShadow = true;
// add cast shadow to the object
// object.castShadow = true;

// only three types of objects can cast shadows: Mesh, Points, and Sprite.
// only three types of objects can receive shadows: Mesh, Points, and Sprite.
// only three types of lights can cast shadows: DirectionalLight, SpotLight, and PointLight.

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
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// create a spot light
const spotLight = new THREE.SpotLight(0xffffff, 0.5, 10, Math.PI * 0.3);
// set spot light position
spotLight.position.set(0, 2, 2);
// set spot light to cast shadow
spotLight.castShadow = true;
// set the target of the spot light
scene.add(spotLight.target);
// add spotlight to the scene
scene.add(spotLight);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, -1);
// cast shadow with the light
directionalLight.castShadow = true;
// set shadow map size to 1024 * 1024 - this will improve the quality of the shadow
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
// set shadow camera frustum near and far plane - this will help to reduce the shadow artifacts
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
// set shadow camera frustum left, right, top, bottom
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;

// adjust shadow radius - add a blur effect to the shadow
directionalLight.shadow.radius = 10;

// add a camera helper to see the shadow map
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
// hide camera helper when done using it
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
// set sphere to cast shadow
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

// add receive shadow to the object
plane.receiveShadow = true;

scene.add(sphere, plane);

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

  // list of shadow map algorithms
  // PCFShadowMap - Percentage Closer Filtering
  // PCFSoftShadowMap - Percentage Closer Filtering with Soft Shadows
  // BasicShadowMap - Basic Shadow Map
  // VSMShadowMap - Variance Shadow Map
  // EVSMShadowMap - Exponential Variance Shadow Map
  // ESMShadowMap - Exponential Shadow Map

  // set shadow map algorithm of the renderer
  // PCFSoftShadowMap does not have any effect if you set radius value
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

// Shadows
renderer.shadowMap.enabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
