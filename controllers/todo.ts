import * as boom from "@hapi/boom";
import * as Joi from "@hapi/joi";
import Koa from "koa";
import * as todo from "../services/todo";
const defaults = {
  limit: 5,
  offset: 0,
};

export async function create(ctx: Koa.Context) {
  const schema = Joi.object().keys({
    description: Joi.string().min(1).max(255).required(),
    title: Joi.string().min(1).max(255).required(),
  });

  const { error, value } = schema.validate({
    description: ctx.request.body.description,
    title: ctx.request.body.title,
  });

  if (error) {
    throw boom.badRequest(error.message);
  }

  ctx.body = await todo.create(value.title, value.description, ctx.user.id);
}

export async function del(ctx: Koa.Context) {
  const schema = Joi.object().keys({
    id: Joi.number().integer().required(),
  });

  const { error, value } = schema.validate({
    id: ctx.params.id,
  });

  if (error) {
    throw boom.badRequest(error.message);
  }

  const check = await todo.findById(value.id, ctx.user.id);
  if (!check) {
    throw boom.notFound("Item already does not exist");
  }
  ctx.body = await todo.del(value.id);
}

export async function update(ctx: Koa.Context) {
  const schema = Joi.object().keys({
    description: Joi.string().min(1).max(255).required(),
    id: Joi.number().integer().required(),
    title: Joi.string().min(1).max(255).required(),
  });

  const { error, value } = schema.validate({
    description: ctx.request.body.description,
    id: ctx.params.id,
    title: ctx.request.body.title,
  });

  if (error) {
    throw boom.badRequest(error.message);
  }

  const data = await todo.findById(value.id, ctx.user.id);
  if (!data) {
    throw boom.notFound("Make sure you update an existing item");
  }

  ctx.body =  await todo.update(value.id, value.title, value.description);
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
  const [ count, rows ] = await todo.list(value.offset, value.limit, ctx.user.id);
  ctx.body = {
    todos: rows.map((v) => ({ id: v.id, title: v.title, userId: v.userId })),
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

  const data = await todo.findById(value.id, ctx.user.id);
  if (!data) {
    throw boom.notFound("This id was not found");
  }

  ctx.body = data;
}
