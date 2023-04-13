import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  // @ts-ignore
  material.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/gradients/3.jpg");
texture.magFilter = THREE.NearestFilter;

const objectsDistance = 4;

// material
const material = new THREE.MeshToonMaterial({
  // @ts-ignore
  color: parameters.materialColor,
  gradientMap: texture,
});

// create three meshes
// TorusGeometry

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);

// cone geometry
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

// TorusKnotGeometry
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

//create particles with buffer geometry
const particleCount = 500;
const positions = new Float32Array(particleCount * 3);

// loop through the particles count

for (let i = 0; i < particleCount; i++) {
  positions[i + 3] = (Math.random() - 0.5) * 10;
  positions[i + 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i + 3 + 2] = (Math.random() - 0.5) * 10;
}

// instantiate the BufferGeometry and set the position attribute
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute(
  "position",
  // @ts-ignore
  new THREE.BufferAttribute(positions, 3)
);

// create material
const particleMaterial = new THREE.PointsMaterial({
  // @ts-ignore
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
});

// create  points
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);
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

// put camera in  a group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  // @ts-ignore
  canvas: canvas,

  // make the canvas transparent by setting the alpha as true
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// move camera on scroll
let scrollY = window.scrollY;
let currentSection = 0;

// add scroll event listener on the window
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);

  if (newSection != currentSection) {
    currentSection = newSection;

    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+3",
    });
  }
});

// get position the cursor
const cursor = {};
cursor.x = 0;
cursor.y = 0;

// add listener for mousemove event
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // animate camera
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  // animate the meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.y += deltaTime * 0.1;
    mesh.rotation.x += deltaTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
