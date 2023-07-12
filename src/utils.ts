import { Mesh, Box3, BoxGeometry, Vector3, BufferGeometry } from "three";

export const removeIntersection = (
  box1: BoxGeometry,
  box2: BoxGeometry
): Mesh | null => {
  const box3_1 = new Box3();
  const box3_2 = new Box3();

  // Set the bounding boxes of the BoxGeometry objects
  box3_1.setFromObject(new Mesh(box1));
  box3_2.setFromObject(new Mesh(box2));

  // Compute the intersection of the bounding boxes
  const intersection = new Box3();
  intersection.copy(box3_1).intersect(box3_2);

  // Check if there is an intersection
  if (!intersection.isEmpty()) {
    // Create a new BoxGeometry using the dimensions of the intersection box
    const intersectionDimensions = intersection.getSize(new Vector3());
    const intersectionBoxGeo = new BoxGeometry(
      intersectionDimensions.x,
      intersectionDimensions.y,
      intersectionDimensions.z
    );

    // Create a mesh using the new BoxGeometry
    return new Mesh(intersectionBoxGeo);
  }

  return null;
};

export const getCenterOfBufferGeometry = (geometry: BufferGeometry) => {
  const positionAttribute = geometry.getAttribute("position");

  // Calculate the average position of the vertices
  const vertexCount = positionAttribute.count;
  const center = new Vector3();

  for (let i = 0; i < vertexCount; i++) {
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = positionAttribute.getZ(i);

    center.x += x;
    center.y += y;
    center.z += z;
  }

  return center.divideScalar(vertexCount);
};
