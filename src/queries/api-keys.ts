import { extendType, nonNull, stringArg } from "nexus";

const APIKeysQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("apiKeys", {
      type: "ApiKey",
      args: {
        userId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        return await ctx.prisma.apiKey.findMany({
          where: { userId: args.userId },
        });
      },
    });
  },
});

export default APIKeysQuery;
