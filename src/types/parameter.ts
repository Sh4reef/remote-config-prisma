import { objectType } from "nexus";

/**
 * Parameter type
 */
const Parameter = objectType({
  name: "Parameter",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("parameter");
    t.nonNull.field("value_type", { type: "ValueTypeEnum" });
    t.string("string_value");
    t.int("integer_value");
    t.boolean("boolean_value");
    t.jsonObject("json_value");
    t.nonNull.string("projectId");
    t.nonNull.list.field("conditionValues", {
      type: "ConditionValue",
      async resolve(parent, __, ctx) {
        return ctx.prisma.conditionValue.findMany({
          where: { parameterId: parent.id },
        });
      },
    });
  },
});

export default Parameter;
