import { objectType } from "nexus";

/**
 * Project type
 */
const Project = objectType({
  name: "Project",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
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
