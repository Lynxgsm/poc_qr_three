import { Scene, BoxGeometry, MeshBasicMaterial, Mesh, Group } from "three";
import QRCode from "qrcode-generator";

class QRCode3D {
  scene: Scene;
  constructor(scene: Scene) {
    this.scene = scene;
  }

  generate() {
    const cubeSize = 1.2; // Size of the cube
    const cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new MeshBasicMaterial({ color: 0xeefffff });
    const cubes = new Group();
    const exportCubes = [];
    const data = "Simple text to convert";
    const qr = QRCode(0, "L");
    qr.addData(data);
    qr.make();

    const qrCodeSize = qr.getModuleCount();

    for (let row = 0; row < qrCodeSize; row++) {
      for (let col = 0; col < qrCodeSize; col++) {
        if (qr.isDark(row, col)) {
          const cube = new Mesh(cubeGeometry, cubeMaterial);
          cube.position.set(col, row, 0);
          cubes.add(cube);
          exportCubes.push(cube);
        }
      }
    }

    const scaleSize = 0.05; // Scale size (to change later)

    cubes.scale.set(scaleSize, scaleSize, scaleSize);
    cubes.position.set(-1.5, -1.5, 2.2);
    this.scene.add(cubes);

    return exportCubes;
  }
}

export default QRCode3D;
