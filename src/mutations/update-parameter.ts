import { extendType, intArg, nonNull } from "nexus";

const UpdateParameterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateParameter", {
      type: "Parameter",
      args: {
        projectId: nonNull(intArg()),
        parameterId: nonNull(intArg()),
        data: nonNull("ParameterInputType"),
      },
      async resolve(_, args, ctx) {
        const updatedParameter = await ctx.prisma.parameter.update({
          where: { projectId: args.projectId, id: args.parameterId },
          data: {
            parameter: args.data.parameter,
            value_type: args.data.value_type,
            string_value: args.data.string_value,
            integer_value: args.data.integer_value,
            boolean_value: args.data.boolean_value,
            json_value: args.data.json_value,
            conditionValues: {
              deleteMany: {
                parameterId: args.parameterId,
              },
            },
          },
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
              parameterId: updatedParameter.id,
              string_value: condition.string_value,
              integer_value: condition.integer_value,
              boolean_value: condition.boolean_value,
              json_value: condition.json_value,
            },
          });
        }

        return updatedParameter;
      },
    });
  },
});

export default UpdateParameterMutation;
