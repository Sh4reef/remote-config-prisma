import { ApolloServer } from "@apollo/server";
import {
  startStandaloneServer,
} from "@apollo/server/standalone";
import schema from "./schema";
import createContext, { Context } from "./context";

const apolloServer = new ApolloServer<Context>({
  schema,
  formatError(formattedError) {
    return {
      message: formattedError.message,
    };
  },
});

(async () => {
  try {
    await startStandaloneServer(apolloServer, {
      context: createContext,
    });

    console.log("URL: http://localhost:4000");
  } catch (error) {
    console.log(error);
  }
})();
