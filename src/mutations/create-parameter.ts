import { extendType, nonNull, stringArg } from "nexus";
import { getUserId } from "../utils";

const CreateParameterMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createParameter", {
      type: "Parameter",
      args: {
        projectId: nonNull(stringArg()),
        data: nonNull("ParameterInputType"),
      },
      async resolve(_, args, ctx) {
        const userId = getUserId(ctx);
        const parameter = await ctx.prisma.parameter.create({
          data: {
            userId,
            parameter: args.data.parameter,
            value_type: args.data.value_type,
            projectId: args.projectId,
            string_value: args.data.string_value,
            integer_value: args.data.integer_value,
            boolean_value: args.data.boolean_value,
            json_value: args.data.json_value,
            enabled: args.data.enabled,
            environment: args.data.environment,
          },
        });
        const parameterOfAnotherEnv = await ctx.prisma.parameter.create({
          data: {
            userId,
            parameter: args.data.parameter,
            value_type: args.data.value_type,
            projectId: args.projectId,
            string_value: args.data.string_value,
            integer_value: args.data.integer_value,
            boolean_value: args.data.boolean_value,
            json_value: args.data.json_value,
            enabled: false,
            environment:
              args.data.environment === "development"
                ? "production"
                : "development",
          },
        });

        /**
         * Create equivalent parameter for each identity in both environments
         */
        const identities = await ctx.prisma.identity.findMany({
          where: {
            projectId: args.projectId,
          },
          select: {
            id: true,
            environment: true,
          },
        });
        await ctx.prisma.identityParameter.createMany({
          data: identities.map((identity) => ({
            userId,
            identityId: identity.id,
            parameterId:
              parameter.environment === "development"
                ? identity.environment === "development"
                  ? parameter.id
                  : parameterOfAnotherEnv.id
                : identity.environment === "production"
                ? parameterOfAnotherEnv.id
                : parameter.id,
          })),
        });

        for (const condition of args.data.conditions) {
          const createdCondition = await ctx.prisma.condition.upsert({
            where: { id: condition.id as string | undefined },
            create: {
              userId,
              projectId: args.projectId,
              name: condition.name,
            },
            update: {
              name: condition.name,
              rules: {
                deleteMany: {
                  conditionId: condition.id as string | undefined,
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
                id: rule.id as string | undefined,
              },
              create: {
                conditionId: createdCondition.id,
                ...ruleValues,
              },
              update: ruleValues,
            });
          }

          await ctx.prisma.conditionValue.createMany({
            data: [
              {
                conditionId: createdCondition.id,
                parameterId: parameter.id,
                string_value: condition.string_value,
                integer_value: condition.integer_value,
                boolean_value: condition.boolean_value,
                json_value: condition.json_value,
              },
              {
                conditionId: createdCondition.id,
                parameterId: parameterOfAnotherEnv.id,
                string_value: condition.string_value,
                integer_value: condition.integer_value,
                boolean_value: condition.boolean_value,
                json_value: condition.json_value,
              },
            ],
          });
        }

        await ctx.prisma.parameter.update({
          where: { id: parameter.id },
          data: { anotherEnvironmentParameterId: parameterOfAnotherEnv.id },
        });
        await ctx.prisma.parameter.update({
          where: { id: parameterOfAnotherEnv.id },
          data: { anotherEnvironmentParameterId: parameter.id },
        });

        return parameter;
      },
    });
  },
});

export default CreateParameterMutation;
