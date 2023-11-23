import { extendType } from "nexus";
import { getUserId } from "../utils";

const Projects = extendType({
  type: "Query",
  definition(t) {
    t.list.field("projects", {
      type: "Project",
      async resolve(_, __, ctx) {
        const userId = getUserId(ctx);
        return await ctx.prisma.project.findMany({ where: { userId } });
      },
    });
  },
});

export default Projects;
