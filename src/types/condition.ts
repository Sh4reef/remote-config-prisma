import { objectType } from "nexus";

/**
 * Condition type
 */
const Condition = objectType({
  name: "Condition",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.int("projectId");
    t.nonNull.list.field("rules", {
      type: "Rule",
      async resolve(parent, __, ctx) {
        return await ctx.prisma.rule.findMany({
          where: { conditionId: parent.id },
        });
      },
    });
  },
});

export default Condition;
