import * as boom from "@hapi/boom";
import * as Joi from "@hapi/joi";
import Koa from "koa";
import * as jwt from "../services/auth";
import * as user from "../services/user";

const defaults = {
  limit: 5,
  offset: 0,
};

export async function create(ctx: Koa.Context) {
  const schema = Joi.object().keys({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(30).required(),
  });

  const { error, value } = schema.validate({
    email: ctx.request.body.email,
    password: ctx.request.body.password,
  });

  if (error) {
    throw boom.badRequest(error.message);
  }

  ctx.body = await user.create(value.email, value.password);
}

export async function list(ctx: Koa.Context) {
  const schema = Joi.object().keys({
    limit: Joi.number().integer().default(defaults.limit),
    offset: Joi.number().integer().default(defaults.offset),
  });
  const { error, value } = schema.validate({
    limit: ctx.query.limit,
    offset: ctx.query.offset,
  });

  if (error) {
    throw boom.badRequest("Enter valid limit and offset");
  }

  const [ count, rows ] = await user.list(value.offset, value.limit);
  ctx.body = {
    todos: rows.map((v) => ({ id: v.id, email: v.email })),
    total: count,
  };
}

export async function findOne(ctx: Koa.Context) {
  const schema = Joi.object().keys({
    id: Joi.number().integer().required(),
  });
  const { error, value } = schema.validate({
    id: ctx.params.id,
  });
  if (error) {
    throw boom.badRequest(error.message);
  }

  const data = await user.findById(value.id);
  if (!data) {
    throw boom.notFound("This id was not found");
  }
  ctx.body = data;
}

export async function signIn(ctx) {
  const schema = Joi.object().keys({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(30).required(),
  });

  const { error, value } = schema.validate({
    email: ctx.request.body.email,
    password: ctx.request.body.password,
  });

  const myUser = await user.verify(value.email, value.password);
  const token = jwt.createToken(myUser);
  ctx.body = {
    id: myUser.id,
    token,
  };
}
