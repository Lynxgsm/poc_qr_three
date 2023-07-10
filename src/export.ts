import { STLExporter } from "three/addons/exporters/STLExporter.js";
import { Mesh } from "three";
const exporter = new STLExporter();

// Configure export options
const options = { binary: true };

// Parse the input and generate the STL encoded output
export const generateSTLFile = (mesh: Mesh, filename: string) => {
  const data = exporter.parse(mesh, options);
  const blob = new Blob([data], { type: "application/octet-stream" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  URL.revokeObjectURL(link.href);
};
