import { extendType, nonNull, stringArg } from "nexus";

const DeleteConditionMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteCondition", {
      type: "Condition",
      args: {
        conditionId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        return await ctx.prisma.condition.delete({
          where: { id: args.conditionId },
        });
      },
    });
  },
});

export default DeleteConditionMutation;
