import { inputObjectType } from "nexus";

/**
 * Identity input type
 */
const IdentityParameterInputType = inputObjectType({
  name: "IdentityParameterInputType",
  definition(t) {
    t.int("identityId");
    t.boolean("isOverwritten");
    t.field("parameter", { type: "ParameterInputType" });
  },
});

export default IdentityParameterInputType;
