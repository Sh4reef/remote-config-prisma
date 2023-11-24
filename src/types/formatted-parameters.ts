import { objectType } from "nexus";

/**
 * FormattedParameters type
 */
const FormattedParameters = objectType({
  name: "FormattedParameters",
  definition(t) {
    t.jsonObject("parameters");
  },
});

export default FormattedParameters;
