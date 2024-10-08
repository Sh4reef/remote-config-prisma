import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import express from "express";
import http from "http";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import schema from "./schema";
import createContext, { Context } from "./context";
import { prisma } from "./client";
import {
  getFormattedParameters,
  getIdentityFormattedParameters,
} from "./helpers";

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

    app.get("/parameters", async (req, res) => {
      const query = req.query;
      const apiKeyObj = await prisma.apiKey.findFirst({
        where: { secret: query.apiKey as string },
        select: {
          userId: true,
          environment: true,
          projectId: true,
        },
      });
      if (!apiKeyObj) {
        return res.status(403).json({ message: "Forbidden" });
      }

      try {
        if (!query.identity) {
          const parameters = await getFormattedParameters(
            prisma,
            apiKeyObj.projectId
          );
          return res.json(parameters);
        }

        const identity = await prisma.identity.findUnique({
          where: {
            identity: `${query.identity}_${apiKeyObj.environment}` as string,
            userId: apiKeyObj.userId,
            environment: apiKeyObj.environment,
          },
          select: {
            id: true,
          },
        });

        if (!identity) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const parameters = await getIdentityFormattedParameters(
          prisma,
          identity.id
        );
        return res.json(parameters);
      } catch (error) {
        return res.status(403).json({ message: "Forbidden" });
      }
    });

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );

    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  } catch (error) {
    console.log(error);
  }
})();
