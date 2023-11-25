import { ApolloServer } from "@apollo/server";
import express from "express";
import http from "http";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import schema from "./schema";
import createContext, { Context } from "./context";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const httpServer = http.createServer(app);
const apolloServer = new ApolloServer<Context>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  formatError(formattedError) {
    return {
      message: formattedError.message,
    };
  },
});

(async () => {
  try {
    await apolloServer.start();

    app.use(
      "/graphql",
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(apolloServer, {
        context: createContext,
      })
    );

    app.get("/identities", async (req, res) => {
      const identities = await prisma.identity.findMany();
      return res.json(identities);
    });

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );

    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  } catch (error) {
    console.log(error);
  }
})();
