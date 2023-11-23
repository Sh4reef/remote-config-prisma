import { extendType } from "nexus";

const Users = extendType({
  type: "Query",
  definition(t) {
    t.list.field("users", {
      type: "User",
      async resolve(_, __, ctx) {
        return await ctx.prisma.user.findMany();
      },
    });
  },
});

export default Users;
