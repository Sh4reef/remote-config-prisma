import { extendType, intArg, nonNull } from "nexus";
import { getUserId } from "../utils";

const Parameters = extendType({
  type: "Query",
  definition(t) {
    t.list.field("parameters", {
      type: "Parameter",
      args: {
        projectId: nonNull(intArg()),
      },
      resolve(_, args, ctx) {
        const userId = getUserId(ctx);
        return ctx.prisma.parameter.findMany({
          where: { projectId: args.projectId, project: { userId } },
        });
      },
    });
  },
});

export default Parameters;
