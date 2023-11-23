import { Rule } from "@prisma/client";
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
