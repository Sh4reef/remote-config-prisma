import { inputObjectType } from "nexus";
import { ValueTypeEnum } from "../enums";

/**
 * Parameter input type
 */
const ParameterInputType = inputObjectType({
  name: "ParameterInputType",
  definition(t) {
    t.nonNull.string("parameter");
    t.nonNull.field("value_type", { type: ValueTypeEnum });
    t.string("string_value");
    t.int("integer_value");
    t.boolean("boolean_value");
    t.string("json_value");
    t.nonNull.list.nonNull.field("conditions", {
      type: "ConditionInputType",
      default: [],
    });
  },
});

export default ParameterInputType;
