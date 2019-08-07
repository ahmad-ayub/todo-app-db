import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import "reflect-metadata";
import * as connection from "./database";
import routes from "./routes";

async function start() {
  await connection.connect();
  const app = new Koa();

  app.use(async (ctx: Koa.Context , next: () => Promise<void>) => {
    try {
      await next();

      if (ctx.status === 404) {
        ctx.body = {
          message: "Route not found",
        };
        ctx.status = 404;
      }
    } catch (err) {
      console.error(err);
      ctx.body = { error: err.message || "Internal server error :(" };

      ctx.status = 500;
      if (err.isBoom) {
        ctx.status = err.output.statusCode;
      }
    }
  });

  app.use(bodyParser());
  app.use(routes);
  app.listen(8080, () => {
    console.log("Server started...");
  });
}

start();
