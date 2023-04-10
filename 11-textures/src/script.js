import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// @ts-ignore
import imageSource from "/textures/door/color.jpg";

// keep in mind these three things when choosing textures
// Weight - size of the textures: jpg is more lighter than png files - uou can compress files using tinypng.com website
// Sizes -
// Data

// One way of loading textures
//  create a new image
// const image = new Image();
// image.src = imageSource;
// // create a new texture
// const texture = new THREE.Texture(image);

// image.onload = () => {
//   // update the texture on image load
//   texture.needsUpdate = true;
// };

// Another way of loading textures is to use the texture loader class

// create a loading manager
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {};
loadingManager.onLoad = () => {};
loadingManager.onProgress = () => {};
loadingManager.onError = () => {};

// create a texture loader
const textureLoader = new THREE.TextureLoader();
// load the texture
const boxTexture = textureLoader.load("/textures/door/sphere.png");
// repeat texture
// boxTexture.repeat.x = 2;
// boxTexture.repeat.y = 3;
// // wrap texture
// boxTexture.wrapS = THREE.RepeatWrapping;
// boxTexture.wrapT = THREE.RepeatWrapping;

// mirror texture
// boxTexture.wrapS = THREE.MirroredRepeatWrapping;
// boxTexture.wrapT = THREE.MirroredRepeatWrapping;

// offset texture
// boxTexture.offset.x = 0.5;
// boxTexture.offset.y = 0.5;

// rotate texture
// boxTexture.rotation = Math.PI * 0.25;
// change rotation vertex
// boxTexture.center.x = 0.5;
// boxTexture.center.y = 0.5;

// mipmapping - reduce the size of the texture if it is too big
// filtering - how the texture is filtered
// minification filter
// use this filter if the texture is too big
boxTexture.minFilter = THREE.NearestFilter;
// NearestFilter improves sharpness

// use the magFilter to increase the size of the texture if the texture is too small
// boxTexture.magFilter = THREE.NearestFilter;

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
// load texture on material
const material = new THREE.MeshBasicMaterial({ map: boxTexture });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

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
camera.position.z = 1;
scene.add(camera);

// Controls
// @ts-ignore
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
