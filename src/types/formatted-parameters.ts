import { objectType } from "nexus";

/**
 * FormattedParameters type
 */
const FormattedParameters = objectType({
  name: "FormattedParameters",
  definition(t) {
    t.json("parameters");
  },
});

export default FormattedParameters;
