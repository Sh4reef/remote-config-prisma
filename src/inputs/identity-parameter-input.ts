import { inputObjectType } from "nexus";

/**
 * Identity input type
 */
const IdentityParameterInputType = inputObjectType({
  name: "IdentityParameterInputType",
  definition(t) {
    t.int("identityId");
    t.boolean("isOverwritten");
    t.string("overwritten_string_value");
    t.int("overwritten_integer_value");
    t.boolean("overwritten_boolean_value");
    t.json("overwritten_json_value");
    t.field("parameter", { type: "ParameterInputType" });
  },
});

export default IdentityParameterInputType;
