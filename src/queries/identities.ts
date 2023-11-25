import { extendType, nonNull, stringArg } from "nexus";

const IdentitiesQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("identities", {
      type: "Identity",
      args: {
        projectId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        return await ctx.prisma.identity.findMany({
          where: { projectId: args.projectId },
        });
      },
    });
  },
});

export default IdentitiesQuery;
