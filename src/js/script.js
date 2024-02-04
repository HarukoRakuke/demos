import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
// Debug
const gui = new dat.GUI();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const squareGeometry = new THREE.PlaneGeometry(1, 1);
const squareMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});

const square1 = new THREE.Mesh(squareGeometry, squareMaterial);
const square2 = new THREE.Mesh(squareGeometry, squareMaterial);

scene.add(square1);
scene.add(square2);

camera.position.z = 5;

const lineGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(),
  new THREE.Vector3(),
]);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

const line = new THREE.Line(lineGeometry, lineMaterial);
line.visible = false; // Set the initial visibility to false
scene.add(line);

let toggle = true;
let radius = 2;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function updateLine() {
  // Set the position of the line based on square1 and square2
  line.geometry.attributes.position.array[0] = square1.position.x;
  line.geometry.attributes.position.array[1] = square1.position.y;
  line.geometry.attributes.position.array[2] = square1.position.z;

  line.geometry.attributes.position.array[3] = square2.position.x;
  line.geometry.attributes.position.array[4] = square2.position.y;
  line.geometry.attributes.position.array[5] = square2.position.z;

  line.geometry.attributes.position.needsUpdate = true;
}

function handleMouseClick(event) {
  // Calculate normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections with squares
  const intersects = raycaster.intersectObjects([square1, square2]);

  if (intersects.length > 0) {
    line.visible = true; // Make the line visible after clicking on either square
  }
}

document.addEventListener('click', handleMouseClick);

function animate() {
  requestAnimationFrame(animate);

  // Circular motion with variations in radius
  const time = Date.now() * 0.0001;

  if (toggle) {
    radius += 0.002;
  } else {
    radius -= 0.002;
  }

  // Toggle the direction of radius variations
  if (radius > 2.5 || radius < 1.5) {
    toggle = !toggle;
  }

  square1.position.x = Math.cos(time) * radius;
  square1.position.y = Math.sin(time) * radius;

  square2.position.x = Math.cos(time + Math.PI) * radius;
  square2.position.y = Math.sin(time + Math.PI) * radius;

  updateLine();

  renderer.render(scene, camera);
}

animate();
