import { objectType } from "nexus";

const ApiKey = objectType({
  name: "ApiKey",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("secret");
    t.nonNull.field("environment", { type: "EnvironmentEnum" });
  },
});

export default ApiKey;
