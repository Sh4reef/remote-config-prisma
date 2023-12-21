import { extendType, nonNull, stringArg } from "nexus";

const ConditionsQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("conditions", {
      type: "Condition",
      args: {
        projectId: nonNull(stringArg()),
        environment: nonNull("EnvironmentEnum"),
      },
      resolve(_, args, ctx) {
        return ctx.prisma.condition.findMany({
          where: { projectId: args.projectId, environment: args.environment },
        });
      },
    });
  },
});

export default ConditionsQuery;
