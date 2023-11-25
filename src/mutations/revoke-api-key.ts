import { extendType, nonNull, stringArg } from "nexus";
import { getUserId } from "../utils";

const RevokeApiKeyMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("revokeApiKey", {
      type: "ApiKey",
      args: {
        apiKeyId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const userId = getUserId(ctx);
        return await ctx.prisma.apiKey.update({
          where: {
            userId,
            id: args.apiKeyId,
          },
          data: {
            secret: crypto.randomUUID(),
          },
        });
      },
    });
  },
});

export default RevokeApiKeyMutation;
