import { extendType, intArg, nonNull } from "nexus";

const ResetIdentityParameterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("resetIdentityParameter", {
      type: "IdentityParameter",
      args: {
        identityParameterId: nonNull(intArg()),
      },
      async resolve(_, args, ctx) {
        return await ctx.prisma.identityParameter.update({
          where: {
            id: args.identityParameterId,
          },
          data: {
            isOverwritten: false,
            overwritten_string_value: null,
            overwritten_integer_value: null,
            overwritten_boolean_value: null,
            overwritten_json_value: null,
          },
        });
      },
    });
  },
});

export default ResetIdentityParameterMutation;
