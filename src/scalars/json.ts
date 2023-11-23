import { scalarType } from "nexus";

/**
 * JsonScalar type
 */
const JsonScalar = scalarType({
  name: "Json",
  asNexusMethod: "json",
  description: "Json custom scalar type",
});

export default JsonScalar;
