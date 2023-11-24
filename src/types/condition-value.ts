import { objectType } from "nexus";

/**
 * ConditionValue type
 */
const ConditionValue = objectType({
  name: "ConditionValue",
  definition(t) {
    t.nonNull.int("id");
    t.string("string_value");
    t.int("integer_value");
    t.boolean("boolean_value");
    t.jsonObject("json_value");
    t.nonNull.int("conditionId");
    t.nonNull.int("parameterId");
    t.field("condition", {
      type: "Condition",
      async resolve(parent, __, ctx) {
        return await ctx.prisma.condition.findUnique({
          where: { id: parent.conditionId },
        });
      },
    });
  },
});

export default ConditionValue;
