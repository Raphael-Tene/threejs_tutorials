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
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

// Galaxy generator

// parameters

const parameters = {};

parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

let geometry = null;
let material = null;
let points = null;

const galaxyGenerator = () => {
  // destroy the previous galaxy
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  // BufferGeometry is an empty geometry that helps you to create your own geometry
  geometry = new THREE.BufferGeometry();
  // create a buffer attribute that will store the position of each vertex
  // use float32Array because it's the most efficient way to store data in the GPU
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  // @ts-ignore
  const colorInside = new THREE.Color(parameters.insideColor);
  // @ts-ignore
  const colorOutside = new THREE.Color(parameters.outsideColor);

  // create a loop for the colors

  // create random particles based on the count parameter
  for (let i = 0; i < parameters.count; i++) {
    // create a random position for each particle
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    //   color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);
    //   set the color
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }
  // add the positions attribute to the geometry
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  // add the colors attribute to the geometry
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // create a material
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  // create a points object
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

galaxyGenerator();
// add tweaks
gui
  .add(parameters, "count")
  .min(100)
  .max(100000)
  .step(100)
  .onFinishChange(galaxyGenerator);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(galaxyGenerator);
gui
  .add(parameters, "radius")
  .min(0.001)
  .max(10)
  .step(0.001)
  .onFinishChange(galaxyGenerator);

gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(galaxyGenerator);

gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(galaxyGenerator);

gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(galaxyGenerator);

gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(galaxyGenerator);
gui.addColor(parameters, "insideColor").onFinishChange(galaxyGenerator);
gui.addColor(parameters, "outsideColor").onFinishChange(galaxyGenerator);
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
camera.position.x = 3;
camera.position.y = 3;
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
