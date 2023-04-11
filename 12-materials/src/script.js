import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import lil-gui
import * as dat from "lil-gui";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// create a cube texture loader: this is used to load a cube map (environments)
const cubeTextureLoader = new THREE.CubeTextureLoader();
// load the cube map
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

// create texture loader
const textureLoader = new THREE.TextureLoader();
const sphereTexture = textureLoader.load("/textures/door/sphere.png");
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
// add minFilter to gradientTexture to improve sharpness
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
// deactivate mipmaping
gradientTexture.generateMipmaps = false;

// create 3 geometry objects
// first parameter is the radius, second is the width segments and the third is the height segments
const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
// first parameter is the width, second is the height and the third is the depth, fourth is the width segments and the fifth is the height segments
const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
// first parameter is the radius, second is the tube radius, third is the radial segments and the fourth is the tubular segments
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);

// texture minification filter
sphereTexture.minFilter = THREE.NearestFilter;

// * create a mesh basic material
// const material = new THREE.MeshBasicMaterial({ map: sphereTexture });
// material methods
// material.wireframe = true; - sets the material to wireframe
// material.transparent = true; - makes the material transparent
// material.alphaMap = doorAlphaTexture; - sets the alpha map
// material.side = THREE.DoubleSide; - sets the material to double sided
//  material opacity - sets the opacity of the material
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// side - let's decide which side of the material is visible
// material.side = THREE.DoubleSide;
// material.side = THREE.BackSide;
// material.side = THREE.FrontSide;

// create mesh normal material
// const material = new THREE.MeshNormalMaterial();
// // mesh normal material has a flat shading effect
// material.flatShading = true;

// create a mesh matcap material
// this material will pick colors from a texture
// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

// create a mesh depth material
// const material = new THREE.MeshDepthMaterial()

// create a mesh lambert material
// const material = new THREE.MeshLambertMaterial();

// create a mesh phong material
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000;
// material.specular = new THREE.Color(0x1188ff);

// create a mesh toon material
// const material = new THREE.MeshToonMaterial();
// // add a gradient map to the material
// material.gradientMap = gradientTexture;

// create a mesh standard material - this material uses the physical based rendering model
//  it supports metalness and roughness with a more realistic look
// const material = new THREE.MeshStandardMaterial();
// // change metalness and roughness
// // material.metalness = 0.7;
// // material.roughness = 0.2;
// material.map = doorColorTexture;
// // add displacement map
// material.displacementMap = doorHeightTexture;
// // change the scale of the displacement map
// material.displacementScale = 0.05;
// // add metalness map
// material.metalnessMap = doorMetalnessTexture;
// // add roughness map
// material.roughnessMap = doorRoughnessTexture;
// // normal map
// material.normalMap = doorNormalTexture;

// // !material aoMap - sets the ambient occlusion map, this makes crevices darker
// material.aoMap = doorAmbientOcclusionTexture;
// // you can change the strength of the ambient occlusion map
// material.aoMapIntensity = 1;

// a new mesh standard material with a metalness and roughness values

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
// add environment map
material.envMap = environmentMapTexture;

// add debug gui
const gui = new dat.GUI({ width: 340 });
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
gui.add(material, "displacementScale").min(0).max(1).step(0.0001);

// create a mesh with the geometry and material
const sphere = new THREE.Mesh(sphereGeometry, material);
const plane = new THREE.Mesh(planeGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material);

// add uv2 to the plane
plane.geometry.setAttribute(
  "uv2",
  // @ts-ignore
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

sphere.position.x = -1.5;
plane.position.x = 0;
torus.position.x = 1.5;

// Scene
const scene = new THREE.Scene();
scene.add(sphere, torus, plane);

// mesh materials that does not support light
// mesh basic material
// mesh depth material
// mesh normal material

// create some lights
// create ambient light
// first parameter is the color of the light and the second is the intensity
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// add the light to the scene
scene.add(ambientLight);
// create a positional light
const pointLight = new THREE.PointLight(0xffffff, 0.5);
// set the position of the light
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
// add the light to the scene
scene.add(pointLight);

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
  // rotate objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
