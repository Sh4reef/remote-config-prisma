import { objectType } from "nexus";

const ApiKey = objectType({
  name: "ApiKey",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("secret");
  },
});

export default ApiKey;
