import { objectType } from "nexus";
import { ValueTypeEnum } from "../enums";

/**
 * Parameter type
 */
const Parameter = objectType({
  name: "Parameter",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("parameter");
    t.nonNull.field("value_type", { type: ValueTypeEnum });
    t.string("string_value");
    t.int("integer_value");
    t.boolean("boolean_value");
    t.string("json_value");
    t.nonNull.int("projectId");
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
