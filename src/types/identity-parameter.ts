import { objectType } from "nexus";

const IdentityParameter = objectType({
  name: "IdentityParameter",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("parameterId");
    t.field("parameter", {
      type: "Parameter",
      async resolve(parent, __, ctx) {
        return await ctx.prisma.parameter.findUnique({
          where: { id: parent.parameterId },
        });
      },
    });
    t.nonNull.boolean("isOverwritten");
    t.string("overwritten_string_value");
    t.int("overwritten_integer_value");
    t.boolean("overwritten_boolean_value");
    t.string("overwritten_json_value");
  },
});

export default IdentityParameter;
