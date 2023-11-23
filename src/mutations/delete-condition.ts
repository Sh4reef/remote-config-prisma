import { extendType, intArg, nonNull } from "nexus";

const DeleteConditionMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteCondition", {
      type: "Condition",
      args: {
        projectId: nonNull(intArg()),
        conditionId: nonNull(intArg()),
      },
      async resolve(_, args, ctx) {
        await ctx.prisma.condition.update({
          where: { projectId: args.projectId, id: args.conditionId },
          data: {
            rules: {
              deleteMany: {
                conditionId: args.conditionId,
              },
            },
            conditionValues: {
              deleteMany: {
                conditionId: args.conditionId,
              },
            },
          },
        });
        return await ctx.prisma.condition.delete({
          where: { projectId: args.projectId, id: args.conditionId },
        });
      },
    });
  },
});

export default DeleteConditionMutation;
