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
        return await ctx.prisma.parameter.delete({
          where: { id: args.parameterId },
        });
      },
    });
  },
});

export default DeleteParameterMutation;
