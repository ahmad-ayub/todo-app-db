import * as boom from "@hapi/boom";
import * as Joi from "@hapi/joi";
import Koa from "koa";
import * as auth from "../services/auth";

export function authenticate(list: string | string[]) {
  return async (ctx: Koa.Context, next: () => void) => {
    const schema = Joi.object().keys({
      token: Joi.string().required(),
    });
    const { value, error } = schema.validate({
      token: ctx.headers.authorization,
    });
    if (error) {
      throw boom.badRequest("Unable to parse token");
    }
    ctx.user = await auth.verifyToken(value.token);

    if (typeof(list) === "string") {
      list = [list];
    }

    if (!list.includes(ctx.user.userType)) {
      throw boom.forbidden("Unspecified User Type");
    }

    await next();
  };
}
