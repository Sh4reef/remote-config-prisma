import { extendType, intArg, nonNull, stringArg } from "nexus";
import { isRulesApplied } from "../helpers";

const IdentityFormattedParametersQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("identityFormattedParameters", {
      type: "FormattedParameters",
      args: {
        projectId: nonNull(intArg()),
        identity: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const identityParameters = await ctx.prisma.identityParameter.findMany({
          where: { identity: { identity: args.identity } },
          include: {
            parameter: {
              include: {
                conditionValues: {
                  include: {
                    condition: {
                      include: {
                        rules: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const formattedIdentityParameters = identityParameters.reduce(
          (prevIdentityParameters, identityParameter) => {
            const parameter = identityParameter.parameter;
            const valueType = parameter.value_type;
            const conditionValues = parameter.conditionValues;
            const isOverwritten = identityParameter.isOverwritten;
            const overwrittenValue =
              identityParameter[`overwritten_${valueType}_value`];
            let value = parameter[`${valueType}_value`];

            if (!isOverwritten) {
              for (const conditionValue of conditionValues) {
                const conditionalValue = conditionValue[`${valueType}_value`];

                const rules = conditionValue.condition.rules;
                const rulesApplied = isRulesApplied(rules);

                value = rulesApplied ? conditionalValue : value;
              }
            }

            return {
              ...prevIdentityParameters,
              [parameter.parameter]: isOverwritten ? overwrittenValue : value,
            };
          },
          {}
        );

        return {
          parameters: formattedIdentityParameters,
        };
      },
    });
  },
});

export default IdentityFormattedParametersQuery;
