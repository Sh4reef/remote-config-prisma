import { extendType, intArg, nonNull } from "nexus";

const UpdateIdentityParameterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateIdentityParameter", {
      type: "IdentityParameter",
      args: {
        identityParameterId: nonNull(intArg()),
        data: nonNull("IdentityParameterInputType"),
      },
      async resolve(_, args, ctx) {
        return await ctx.prisma.identityParameter.update({
          where: { id: args.identityParameterId },
          data: {
            isOverwritten: true,
            overwritten_string_value: args.data.overwritten_string_value,
            overwritten_integer_value: args.data.overwritten_integer_value,
            overwritten_boolean_value: args.data.overwritten_boolean_value,
            overwritten_json_value: args.data.overwritten_json_value,
          },
        });
      },
    });
  },
});

export default UpdateIdentityParameterMutation;
