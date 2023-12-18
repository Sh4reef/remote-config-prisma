import { extendType, nonNull, stringArg } from "nexus";

const ParametersQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("parameters", {
      type: "Parameter",
      args: {
        projectId: nonNull(stringArg()),
        environment: nonNull("EnvironmentEnum"),
      },
      resolve(_, args, ctx) {
        return ctx.prisma.parameter.findMany({
          where: { projectId: args.projectId, environment: args.environment },
          orderBy: { createdAt: "desc" },
        });
      },
    });
  },
});

export default ParametersQuery;
