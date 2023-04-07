// @ts-nocheck
// create a new scene
const scene = new THREE.Scene();

// create a red cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
// add a material and color
const material = new THREE.MeshBasicMaterial({ color: "red" });
// create a mesh containing the geometry and material
const mesh = new THREE.Mesh(geometry, material);
// add mesh to the scene
scene.add(mesh);

// create aspect ratio sizes
const sizes = { width: 800, height: 600 };

// create a camera for the scene
// parameters: field of view and aspect ratio
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// add camera to the scene
scene.add(camera);
// move camera back
camera.position.z = 3;

// create  a renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
// set the renderer size
renderer.setSize(sizes.width, sizes.height);

// render the scene
renderer.render(scene, camera);
