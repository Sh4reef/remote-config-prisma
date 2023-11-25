import { extendType, nonNull, stringArg } from "nexus";

const ParametersQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("parameters", {
      type: "Parameter",
      args: {
        projectId: nonNull(stringArg()),
      },
      resolve(_, args, ctx) {
        return ctx.prisma.parameter.findMany({
          where: { projectId: args.projectId },
        });
      },
    });
  },
});

export default ParametersQuery;
