import { extendType, nonNull, stringArg } from "nexus";
import { getUserId } from "../utils";

const CreateApiKeyMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createApiKey", {
      type: "ApiKey",
      args: {
        name: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const userId = getUserId(ctx);
        return await ctx.prisma.apiKey.create({
          data: {
            userId,
            name: args.name,
            secret: crypto.randomUUID(),
          },
        });
      },
    });
  },
});

export default CreateApiKeyMutation;
