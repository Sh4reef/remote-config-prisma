import { extendType, nonNull, stringArg } from "nexus";
import { getIdentityFormattedParameters } from "../helpers";

const IdentityFormattedParametersQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("identityFormattedParameters", {
      type: "FormattedParameters",
      args: {
        identityId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const formattedIdentityParameters =
          await getIdentityFormattedParameters(ctx.prisma, args.identityId);

        return {
          parameters: formattedIdentityParameters,
        };
      },
    });
  },
});

export default IdentityFormattedParametersQuery;
