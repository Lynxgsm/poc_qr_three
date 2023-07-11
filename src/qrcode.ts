import {
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Group,
} from "three";
import QRCode from "qrcode-generator";
import { initialScaleFactor } from "./constants";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js"

class QRCode3D {
  scene: Scene;
  constructor(scene: Scene) {
    this.scene = scene;
  }

  generate() {
    const cubeSize = 1.2; // Size of the cube
    const cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize + 2);
    const cubeMaterial = new MeshBasicMaterial({ color: 0xeefffff });
    const cubes = new Mesh();
    let joinedCube: Group = new Group();
    const exportCubes = [];
    const data = "Simple text to convert";
    const qr = QRCode(0, "L");
    qr.addData(data);
    qr.make();

    const qrCodeSize = qr.getModuleCount();

    for (let row = 0; row < qrCodeSize; row++) {
      for (let col = 0; col < qrCodeSize; col++) {
        if (!qr.isDark(row, col)) {
          const cube = new Mesh(cubeGeometry, cubeMaterial);
          cube.position.set(col, row, 0);
          cubes.add(cube);
          joinedCube.add(cube);
          exportCubes.push(cube);
        }
      }
    }

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(
      exportCubes.map((cube) => {
        cube.updateMatrix(); // Make sure the mesh's matrix is updated
        var childGeometry = cube.geometry.clone(); // Clone the geometry to avoid modifying the original
        childGeometry.applyMatrix4(cube.matrix); // Apply the mesh's matrix to the geometry
        return childGeometry;
      })
    );

    const mergedMesh = new Mesh(mergedGeometry, cubeMaterial);

    mergedMesh.scale.set(
      initialScaleFactor,
      initialScaleFactor,
      initialScaleFactor
    );

    mergedMesh.position.set(-1.5, -1.5, 2.03); // To control with GUI later
    this.scene.add(mergedMesh);

    return mergedMesh;
  }
}

export default QRCode3D;
