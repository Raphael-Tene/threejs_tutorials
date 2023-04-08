import * as THREE from "three";

// use gsap for animation
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  // @ts-ignore
  canvas: canvas,
});

// Get the current time
// let time = Date.now();

// control the animation speed using clock
const clock = new THREE.Clock();

// Animation
const tick = () => {
  // control animation based on timestamp Date.now
  //   const currentTime = Date.now();

  //   const deltaTime = currentTime - time;

  // update time for the next frame
  //   time = currentTime;
  // mesh.rotation.y += (0.01 * deltaTime) / 10;

  // control animation based on clock
  const elapsedTime = clock.getElapsedTime();
  // get one rotation per second
  //   mesh.rotation.y = elapsedTime * Math.PI * 2;
  //   mesh.rotation.y = elapsedTime;

  //   mesh.position.x = Math.sin(elapsedTime);
  //   mesh.position.y = Math.cos(elapsedTime);
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
renderer.setSize(sizes.width, sizes.height);

gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
renderer.render(scene, camera);
