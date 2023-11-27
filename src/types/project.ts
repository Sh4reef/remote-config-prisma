import { objectType } from "nexus";

/**
 * Project type
 */
const Project = objectType({
  name: "Project",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("userId");
    t.nonNull.string("name");
    t.list.field("apiKeys", {
      type: "ApiKey",
      async resolve(parent, _, ctx) {
        return await ctx.prisma.apiKey.findMany({
          where: { projectId: parent.id },
        });
      },
    });
    t.list.field("parameters", {
      type: "Parameter",
      resolve(parent, __, ctx) {
        return ctx.prisma.parameter.findMany({
          where: { projectId: parent.id },
        });
      },
    });
  },
});

export default Project;
