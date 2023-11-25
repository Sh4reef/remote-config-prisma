import { objectType } from "nexus";

/**
 * IdentityParameter type
 */
const IdentityParameter = objectType({
  name: "IdentityParameter",
  definition(t) {
    t.nonNull.string("id");
    t.string("identityId");
    t.nonNull.boolean("isOverwritten");
    t.string("overwritten_string_value");
    t.int("overwritten_integer_value");
    t.boolean("overwritten_boolean_value");
    t.jsonObject("overwritten_json_value");
    t.nonNull.string("parameterId");
    t.field("parameter", {
      type: "Parameter",
      async resolve(parent, __, ctx) {
        return await ctx.prisma.parameter.findUnique({
          where: { id: parent.parameterId },
        });
      },
    });
  },
});

export default IdentityParameter;
