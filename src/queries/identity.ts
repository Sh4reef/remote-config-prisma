import { extendType, nonNull, stringArg } from "nexus";

const IdentityQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getIdentity", {
      type: "Identity",
      args: {
        identity: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        return await ctx.prisma.identity.findFirst({
          where: { identity: args.identity },
        });
      },
    });
  },
});

export default IdentityQuery;
