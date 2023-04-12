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

// fog
// add fog
const fog = new THREE.Fog("#262837", 1, 16);

// Scene
const scene = new THREE.Scene();
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Group
 */
// House
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({ color: "#ac8e82" })
);
// cast shadow
walls.castShadow = true;
walls.position.y = 1.25;
house.add(walls);

// bricks textures
const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  " /textures/bricks/roughness.jpg"
);
// add bricks texture to the wall
walls.material.map = bricksColorTexture;
walls.material.aoMap = bricksAmbientOcclusionTexture;
walls.material.normalMap = bricksNormalTexture;
walls.material.roughnessMap = bricksRoughnessTexture;

walls.material.roughness = 1;

walls.geometry.setAttribute(
  "uv2",
  // @ts-ignore
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
// cast shadow
roof.castShadow = true;
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// load grass textures
const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

// repeat grass textures
grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

// set grass texture to the floor
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

// Door

// Door textures
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    color: "#aa7e6b",
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    aoMapIntensity: 1,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  // @ts-ignore
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

// add texture to the bush
const bushTexture = textureLoader.load("/textures/grass/color.jpg");
bushMaterial.map = bushTexture;

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(0.8, 0.2, 2.2);
bush1.scale.set(0.5, 0.5, 0.5);
house.add(bush1);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(1.4, 0.1, 2.1);
bush2.scale.set(0.25, 0.25, 0.25);
house.add(bush2);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.scale.set(0.25, 0.25, 0.25);
house.add(bush3);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1, 0.05, 2.6);
bush4.scale.set(0.4, 0.4, 0.4);
house.add(bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  // cast shadow
  grave.castShadow = true;
  grave.position.set(x, 0.3, z);
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: "#a9c388" })
);

// shadow
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

// add grass texture to the floor
floor.material.map = grassColorTexture;
floor.material.aoMap = grassAmbientOcclusionTexture;
floor.material.normalMap = grassNormalTexture;
floor.material.roughnessMap = grassRoughnessTexture;
floor.geometry.setAttribute(
  "uv2",
  // @ts-ignore
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.12);

gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
// create shadow
moonLight.castShadow = true;
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
// cast shadow
doorLight.castShadow = true;
// optimize the shadow
doorLight.shadow.mapSize.width = 256;
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// ghosts
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
scene.add(ghost1);
// cast shadow
ghost1.castShadow = true;
// optimize the shadow
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);
// cast shadow
ghost2.castShadow = true;

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);
// cast shadow
ghost3.castShadow = true;

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
// activate shadows
renderer.shadowMap.enabled = true;
// set renderer clear color
renderer.setClearColor("#262837");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // animate ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
