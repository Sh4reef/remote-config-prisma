import { extendType, intArg, nonNull } from "nexus";

const CreateParameterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createParameter", {
      type: "Parameter",
      args: {
        projectId: nonNull(intArg()),
        data: nonNull("ParameterInputType"),
      },
      async resolve(_, args, ctx) {
        /**
         * Create parameter
         */
        const parameter = await ctx.prisma.parameter.create({
          data: {
            parameter: args.data.parameter,
            value_type: args.data.value_type,
            projectId: args.projectId,
            string_value: args.data.string_value,
            integer_value: args.data.integer_value,
            boolean_value: args.data.boolean_value,
            json_value: args.data.json_value,
          },
        });

        /**
         * Create equivalent parameter for each identity
         */
        const identities = await ctx.prisma.identity.findMany({
          where: { projectId: args.projectId },
          select: {
            id: true,
          },
        });
        await ctx.prisma.identityParameter.createMany({
          data: identities.map((identity) => ({
            identityId: identity.id,
            parameterId: parameter.id,
          })),
        });

        for (const condition of args.data.conditions) {
          const createdCondition = await ctx.prisma.condition.upsert({
            where: { id: Number(condition.id || 0) },
            create: {
              projectId: args.projectId,
              name: condition.name,
            },
            update: {
              name: condition.name,
              rules: {
                deleteMany: {
                  conditionId: Number(condition.id || 0),
                },
              },
            },
          });

          for (const rule of condition.rules) {
            const ruleValues = {
              rule: rule.rule,
              datetime: rule.datetime,
              platform: rule.platform,
              language: rule.language,
              country: rule.country,
              before_datetime: rule.before_datetime,
            };
            await ctx.prisma.rule.upsert({
              where: {
                id: Number(rule.id || 0),
              },
              create: {
                conditionId: createdCondition.id,
                ...ruleValues,
              },
              update: ruleValues,
            });
          }

          await ctx.prisma.conditionValue.create({
            data: {
              conditionId: createdCondition.id,
              parameterId: parameter.id,
              string_value: condition.string_value,
              integer_value: condition.integer_value,
              boolean_value: condition.boolean_value,
              json_value: condition.json_value,
            },
          });
        }

        return parameter;
      },
    });
  },
});

export default CreateParameterMutation;
