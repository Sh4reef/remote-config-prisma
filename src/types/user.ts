import { objectType } from "nexus";
import { IS_DEVELOPMENT } from "../variables";

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

    // fields that only visible on development
    if (IS_DEVELOPMENT) {
      t.boolean("verified");
      t.string("verification_code");
    }
  },
});

export default User;
