// script.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es/dist/cannon-es.js";

// Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Create Planets
const planets = [];
function createPlanet(name, size, color, distance) {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = distance;
  scene.add(planet);
  planets.push({ name, object: planet });
}

// Add Solar System Planets
createPlanet("Earth", 6371 / 1000, 0x0000ff, 0);
createPlanet("Moon", 1737 / 1000, 0xaaaaaa, 384);

// Rocket
const rocketGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
const rocketMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
scene.add(rocket);
rocket.position.y = 1;

// Rocket Physics
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
const rocketBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Cylinder(0.1, 0.1, 2, 16),
});
rocketBody.position.set(0, 1, 0);
world.addBody(rocketBody);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 10, 20);
controls.update();

// Game Loop
let lastTime;
function animate(time) {
  requestAnimationFrame(animate);

  // Physics Update
  const deltaTime = lastTime ? (time - lastTime) / 1000 : 0;
  world.step(1 / 60, deltaTime);

  rocket.position.copy(rocketBody.position);
  rocket.quaternion.copy(rocketBody.quaternion);

  // Render Scene
  renderer.render(scene, camera);

  lastTime = time;
}
animate();

// Map View Toggle
document.getElementById("mapButton").addEventListener("click", () => {
  camera.position.set(0, 100, 0);
  camera.lookAt(0, 0, 0);
  controls.update();
});
