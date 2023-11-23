import { extendType, intArg, nonNull } from "nexus";
import { getUserId } from "../utils";

const Conditions = extendType({
  type: "Query",
  definition(t) {
    t.list.field("conditions", {
      type: "Condition",
      args: {
        projectId: nonNull(intArg()),
      },
      resolve(_, args, ctx) {
        const userId = getUserId(ctx);

        if (!args.projectId) {
          throw new Error("projectId query parameter is required!");
        }

        return ctx.prisma.condition.findMany({
          where: { projectId: args.projectId, project: { userId } },
        });
      },
    });
  },
});

export default Conditions;
