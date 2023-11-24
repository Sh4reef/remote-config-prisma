import { objectType } from "nexus";

/**
 * Rule type
 */
const Rule = objectType({
  name: "Rule",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("conditionId");
    t.nonNull.field("rule", { type: "RuleEnum" });
    t.field("language", { type: "LanguageEnum" });
    t.field("platform", { type: "PlatformEnum" });
    t.field("country", { type: "CountryEnum" });
    t.string("country");
    t.datetime("datetime");
    t.boolean("before_datetime");
  },
});

export default Rule;
