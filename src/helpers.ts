import { PrismaClient, Rule } from "@prisma/client";
import moment from "moment";

export const isRulesApplied = (rules: Rule[]) => {
  return rules.every((rule) => {
    const ruleType = rule["rule"];
    const ruleValue = rule[ruleType];

    // datetime logic
    if (ruleType === "datetime") {
      var isBefore = rule["before_datetime"];
      if (isBefore) {
        return moment().isBefore(ruleValue);
      } else {
        return moment().isAfter(ruleValue);
      }
    }
  });
};

export const getFormattedParameters = async (
  prisma: PrismaClient,
  projectId: string
) => {
  const parameters = await prisma.parameter.findMany({
    where: { projectId: projectId },
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
  });

  const formattedParameters = parameters.reduce((prevParameters, parameter) => {
    const valueType = parameter["value_type"];
    const conditionValues = parameter["conditionValues"];
    let value = parameter[`${valueType}_value`];

    conditionValues.forEach((conditionValue) => {
      const conditionalValue = conditionValue[`${valueType}_value`];
      const rules = conditionValue["condition"]["rules"];
      const rulesApplied = isRulesApplied(rules);

      value = rulesApplied ? conditionalValue : value;
    });

    return {
      ...prevParameters,
      [parameter.parameter]: value,
    };
  }, {});

  return formattedParameters;
};

export const getIdentityFormattedParameters = async (
  prisma: PrismaClient,
  identityId: string
) => {
  const identityParameters = await prisma.identityParameter.findMany({
    where: {
      identity: { id: identityId },
    },
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

  return formattedIdentityParameters;
};
