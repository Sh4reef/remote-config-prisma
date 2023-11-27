import { extendType, nonNull, stringArg } from "nexus";
import crypto from "crypto";
import { getUserId } from "../utils";

const CreateApiKeyMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createApiKey", {
      type: "ApiKey",
      args: {
        name: nonNull(stringArg()),
        projectId: nonNull(stringArg()),
        environment: nonNull("EnvironmentEnum"),
      },
      async resolve(_, args, ctx) {
        const userId = getUserId(ctx);
        return await ctx.prisma.apiKey.create({
          data: {
            userId,
            name: args.name,
            secret: crypto.randomBytes(16).toString("base64url"),
            projectId: args.projectId,
            environment: args.environment,
          },
        });
      },
    });
  },
});

export default CreateApiKeyMutation;
