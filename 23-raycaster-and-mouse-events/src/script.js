import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

// Raycaster
// Raycaster is used to detect objects in the scene
const raycaster = new THREE.Raycaster();
// // provide origin and direction of the raycaster
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// // normalize the direction vector
// rayDirection.normalize();
// // set the raycaster origin and direction
// raycaster.set(rayOrigin, rayDirection);
// // test the raycaster against the objects in the scene
// const intersects = raycaster.intersectObjects(scene.children);

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

// mouse
const mouse = new THREE.Vector2();

// mouse move event to get coordinates of the spheres
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

// mouse click
window.addEventListener("click", (event) => {
  if (currentIntersect.object === object1) {
    // add what should happen here
  } else if (currentIntersect.object === object2) {
    // add what should happen here
  } else if (currentIntersect.object === object3) {
    // add what should happen here
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

// initiate loader
const gltfLoader = new GLTFLoader();
// load model
let model = null;

gltfLoader.load("./models/Duck/glTF-Binary/Duck.glb", (gltf) => {
  model = gltf.scene;
  model.position.y = -1.2;
  scene.add(model);
});

// lights

const ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffff", 0.7);
// set position
directionalLight.position.set(1, 2, 3);

scene.add(directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();
// create a variable to witness the intersection
let currentIntersect = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // animate the objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.6) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 0.9) * 1.5;

  // cast ray
  raycaster.setFromCamera(mouse, camera);

  //   const rayOrigin = new THREE.Vector3(-3, 0, 0);
  //   const rayDirection = new THREE.Vector3(10, 0, 0);

  //   rayDirection.normalize();
  //   raycaster.set(rayOrigin, rayDirection);

  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);
  //   console.log(intersects);
  // change object color when they are intersected with the raycaster
  for (const object of objectsToTest) {
    object.material.color.set("#ff0000");
  }

  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }

  // enable witness
  if (intersects.length) {
    currentIntersect = intersects[0];
  } else {
    currentIntersect = null;
  }

  // scale model on hover
  if (model) {
    const modelIntersect = raycaster.intersectObject(model);
    if (modelIntersect.length) {
      model.scale.set(1.5, 1.5, 1.5);
    } else {
      model.scale.set(1, 1, 1);
    }
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
