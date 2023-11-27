import { inputObjectType } from "nexus";

/**
 * Identity input type
 */
const IdentityInputType = inputObjectType({
  name: "IdentityInputType",
  definition(t) {
    t.nonNull.string("identity");
    t.field("platform", { type: "PlatformEnum" });
    t.field("language", { type: "LanguageEnum" });
    t.field("country", { type: "CountryEnum" });
    t.nonNull.field("environment", { type: "EnvironmentEnum" });
    t.list.field("parameters", { type: "IdentityParameterInputType" });
  },
});

export default IdentityInputType;
