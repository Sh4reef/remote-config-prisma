import { objectType } from "nexus";

/**
 * Condition type
 */
const Condition = objectType({
  name: "Condition",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("projectId");
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
