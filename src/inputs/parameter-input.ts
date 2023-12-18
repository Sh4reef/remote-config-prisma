import { inputObjectType } from "nexus";

/**
 * Parameter input type
 */
const ParameterInputType = inputObjectType({
  name: "ParameterInputType",
  definition(t) {
    t.nonNull.string("parameter");
    t.nonNull.field("value_type", { type: "ValueTypeEnum" });
    t.string("string_value");
    t.int("integer_value");
    t.boolean("boolean_value");
    t.jsonObject("json_value");
    t.nonNull.boolean("enabled", { default: false });
    t.nonNull.list.nonNull.field("conditions", {
      type: "ConditionInputType",
      default: [],
    });
  },
});

export default ParameterInputType;
