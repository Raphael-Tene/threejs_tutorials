// import THree from 'three';
import * as THREE from "three";

// @ts-nocheck
// create a new scene
const scene = new THREE.Scene();

// create a group
const group = new THREE.Group();

// change the position of the group
group.position.y = 0.5;
group.scale.y = 2;

// add group to the scene
scene.add(group);

// create a cube
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

// add cube1 to the group
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);

// add cube2 to the group
group.add(cube2);
cube2.position.x = -1.5;

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0 })
);

// add cube3 to the group
group.add(cube3);
cube3.position.x = 1.5;

// add mesh to the scene
// scene.add(mesh);

// in case you need to visualize the axes to position items, you can use the following code to display the axes
// create axis helper

const axesHelper = new THREE.AxesHelper();
// add axis helper to the scene
scene.add(axesHelper);

// create aspect ratio sizes
const sizes = { width: 800, height: 600 };

// create a camera for the scene
// parameters: field of view and aspect ratio
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// add camera to the scene
scene.add(camera);
// move camera back
camera.position.z = 3;
// change camera view using lookAt method
// camera.lookAt(mesh.position);

// create  a renderer
const canvas = document.querySelector(".webgl");
// @ts-ignore
const renderer = new THREE.WebGLRenderer({ canvas });
// set the renderer size
renderer.setSize(sizes.width, sizes.height);

// render the scene
renderer.render(scene, camera);
