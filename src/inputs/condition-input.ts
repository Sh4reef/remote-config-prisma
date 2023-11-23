import { inputObjectType } from "nexus";

/**
 * Condition input type
 */
const ConditionInputType = inputObjectType({
  name: "ConditionInputType",
  definition(t) {
    t.int("id");
    t.nonNull.string("name");
    t.string("string_value");
    t.int("integer_value");
    t.boolean("boolean_value");
    t.string("json_value");
    t.nonNull.list.nonNull.field("rules", {
      type: "RuleInputType",
      default: [],
    });
  },
});

export default ConditionInputType;
