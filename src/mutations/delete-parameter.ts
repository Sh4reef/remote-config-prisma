import { extendType, intArg, nonNull } from "nexus";

const DeleteParameterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteParameter", {
      type: "Parameter",
      args: {
        projectId: nonNull(intArg()),
        parameterId: nonNull(intArg()),
      },
      async resolve(_, args, ctx) {
        await ctx.prisma.parameter.update({
          where: { projectId: args.projectId, id: args.parameterId },
          data: {
            identities: {
              deleteMany: {
                parameterId: args.parameterId
              }
            },
            conditionValues: {
              deleteMany: {
                parameterId: args.parameterId,
              },
            },
          },
        });
        return await ctx.prisma.parameter.delete({
          where: { projectId: args.projectId, id: args.parameterId },
        });
      },
    });
  },
});

export default DeleteParameterMutation;
