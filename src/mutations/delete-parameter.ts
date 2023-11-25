import { extendType, nonNull, stringArg } from "nexus";

const DeleteParameterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteParameter", {
      type: "Parameter",
      args: {
        parameterId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        await ctx.prisma.parameter.update({
          where: { id: args.parameterId },
          data: {
            identities: {
              deleteMany: {
                parameterId: args.parameterId,
              },
            },
            conditionValues: {
              deleteMany: {
                parameterId: args.parameterId,
              },
            },
          },
        });
        return await ctx.prisma.parameter.delete({
          where: { id: args.parameterId },
        });
      },
    });
  },
});

export default DeleteParameterMutation;
