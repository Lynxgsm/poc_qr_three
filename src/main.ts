import "./style.css";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import QRCode3D from "./qrcode";
import { generateSTLFile } from "./export";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new WebGLRenderer();

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
qrcode3D.generate();

// Load STL File
const loader = new STLLoader();
loader.load("../assets/models/cube.stl", function (geometry) {
  const material = new MeshPhongMaterial({
    color: 0xff5533,
    specular: 0x111111,
    shininess: 200,
  });
  const mesh = new Mesh(geometry, material);

  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, -Math.PI / 2, 0);
  mesh.scale.set(2, 2, 2);

  scene.add(mesh);
});

// Generate final STL File
document.querySelector("button")?.addEventListener("click", () => {
  if (scene) {
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
