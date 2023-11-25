import { objectType } from "nexus";

/**
 * ****** User type ******
 */
const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.string("name");
    t.string("email");
    t.list.field("projects", {
      type: "Project",
      resolve(parent, _, ctx) {
        return ctx.prisma.project.findMany({ where: { userId: parent.id } });
      },
    });
  },
});

export default User;
