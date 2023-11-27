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
        const deletedParameter = await ctx.prisma.parameter.delete({
          where: { id: args.parameterId },
        });
        await ctx.prisma.parameter.delete({
          where: { id: deletedParameter.anotherEnvironmentParameterId! },
        });
        return deletedParameter;
      },
    });
  },
});

export default DeleteParameterMutation;
