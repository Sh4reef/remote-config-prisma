import { inputObjectType } from "nexus";

/**
 * Rule input type
 */
const RuleInputType = inputObjectType({
  name: "RuleInputType",
  definition(t) {
    t.string("id");
    t.nonNull.field("rule", { type: "RuleEnum" });
    t.field("language", { type: "LanguageEnum" });
    t.field("platform", { type: "PlatformEnum" });
    t.field("country", { type: "CountryEnum" });
    t.datetime("datetime");
    t.boolean("before_datetime");
  },
});

export default RuleInputType;
