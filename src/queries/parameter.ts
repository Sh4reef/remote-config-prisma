import { extendType, nonNull, stringArg } from "nexus";

const ParameterQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getParameter", {
      type: "Parameter",
      args: {
        parameterId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        return await ctx.prisma.parameter.findUniqueOrThrow({
          where: { id: args.parameterId },
        });
      },
    });
  },
});

export default ParameterQuery;
