import { extendType, nonNull, stringArg } from "nexus";

const IdentityQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("getIdentity", {
      type: "Identity",
      args: {
        identityId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        return await ctx.prisma.identity.findUniqueOrThrow({
          where: { id: args.identityId },
        });
      },
    });
  },
});

export default IdentityQuery;
