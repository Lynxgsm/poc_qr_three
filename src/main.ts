import "./style.css";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import QRCode3D from "./qrcode";
import { generateSTLFile } from "./export";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { CSG } from "three-csg-ts";

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new WebGLRenderer();
const raycaster = new Raycaster();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;

// Put the generated 3D QRCode
const qrcode3D = new QRCode3D(scene);
const joinedCube = qrcode3D.generate();
let loadedMesh: Mesh | null = null;

// Check if object is placed
let isNotPlaced = true;
let canBePlaced = false;

const toggleScaleRange = () => {
  const scaleRange = document.querySelector(
    'input[type="range"]'
  ) as HTMLInputElement;
  if (isNotPlaced) {
    scaleRange.classList.remove("block");
    scaleRange.classList.add("hidden");
  } else {
    scaleRange.classList.remove("hidden");
    scaleRange.classList.add("block");
  }
};

// Adding onmousemove event to point to the STL Object
window.addEventListener("mousemove", (e) => {
  canBePlaced = false;
  toggleScaleRange();

  if (isNotPlaced) {
    scene.remove(joinedCube);
    const mouse = new Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      const closestObject = intersects[0].point;
      canBePlaced = true;
      if (closestObject) {
        // Positioning the QRCode
        joinedCube.position.copy(
          new Vector3(closestObject.x, closestObject.y, closestObject.z - 0.05)
        );

        joinedCube.geometry.center();

        scene.add(joinedCube);
      }
    }
  }
});

window.addEventListener("click", () => {
  if (canBePlaced) {
    isNotPlaced = !isNotPlaced;
  }
});

window.addEventListener("dblclick", () => {
  isNotPlaced = !isNotPlaced;
});

// Adjust QRCode size
const slider = document.querySelector('input[type="range"]');
slider?.addEventListener("input", (e) => {
  const value = parseInt((e.currentTarget as HTMLInputElement).value);
  let scaleFactor = (value * 0.1) / 100; // .1 is the max value if initial is 0.05
  joinedCube.scale.set(scaleFactor, scaleFactor, scaleFactor);
});

// Load STL File
const loader = new STLLoader();
loader.load("../assets/models/cube.stl", function (geometry) {
  const material = new MeshPhongMaterial({
    color: 0xff5533,
    specular: 0x111111,
    shininess: 200,
  });
  const mesh = new Mesh(geometry, material);
  loadedMesh = mesh;

  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, -Math.PI / 2, 0);
  mesh.scale.set(2, 2, 2);

  scene.add(mesh);
});

// Generate final STL File
document.querySelector("button")?.addEventListener("click", () => {
  if (scene && loadedMesh) {
    const newObject = CSG.subtract(loadedMesh, joinedCube);

    scene.remove(joinedCube!);
    scene.remove(loadedMesh);
    scene.add(newObject);
    generateSTLFile(scene, "mesh.stl");
  }
});

// Add orbit control to control camera
new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
