import { inputObjectType } from "nexus";

/**
 * Identity input type
 */
const IdentityParameterInputType = inputObjectType({
  name: "IdentityParameterInputType",
  definition(t) {
    t.string("overwritten_string_value");
    t.int("overwritten_integer_value");
    t.boolean("overwritten_boolean_value");
    t.jsonObject("overwritten_json_value");
  },
});

export default IdentityParameterInputType;
