import {
  BoxGeometry,
  BufferGeometry,
  Mesh,
  NormalBufferAttributes,
} from "three";
import { scaleFactor } from "./constants";

export const convertBoxGeometryIntoBufferGeometry = (geometry: BoxGeometry) => {
  return geometry.normalizeNormals();
};

export const createGeometryWithChanges = (
  mesh: Mesh<BufferGeometry<NormalBufferAttributes>>
) => {
  const newMesh = new Mesh(mesh.geometry, mesh.material);
  newMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
  const { x, y, z } = mesh.position;
  newMesh.position.set(x, y, z);
  return newMesh;
};
