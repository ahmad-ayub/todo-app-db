
import * as boom from "@hapi/boom";
import * as bcrypt from "bcrypt";
import { getConnection } from "typeorm";
import User from "../entities/User";

export async function list(offset: number, limit: number): Promise<[number, any[]]> {
  const userRepo = getConnection().getRepository(User);
  const [ rows, count ] = await userRepo.findAndCount({
    skip: offset,
    take: limit,
  });

  return [count, rows];
}

export async function create(email: string, password: string) {
  const hashPass = await bcrypt.hash(password, 10);
  const userRepo = getConnection().getRepository(User);

  const user = await userRepo.save(userRepo.create({
    email,
    password: hashPass,
  }));

  delete user.password;
  return user;
}

export async function verify(email: string, password: string): Promise<User> {
  const userRepo = getConnection().getRepository(User);
  const user = await userRepo.findOne({
    email,
  }, {
    select: ["id", "email", "password"],
  });

  if (await bcrypt.compare(password, user.password) !== true) {
    throw boom.unauthorized("Incorrect password");
  }

  delete user.password;
  return user;
}

export function findById(id: number) {
  const userRepo = getConnection().getRepository(User);
  return userRepo.findOne({
    where: {
      id,
    },
  });
}
