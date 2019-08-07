import * as boom from "@hapi/boom";
import * as jwt from "jsonwebtoken";
import User from "../entities/User";
import * as userService from "../services/user";

export function createToken(user: User) {
  const token = jwt.sign({id: user.id}, "secretKey", {
    expiresIn: 86400,
  });
  return token;
}

export async function verifyToken(token: string): Promise<User> {
  try {
    const decoded: any = await jwt.verify(token, "secretKey");
    if (!decoded.id) {
      throw boom.unauthorized("Invalid token");
    }
    return userService.findById(decoded.id);
  } catch (err) {
    throw boom.unauthorized("Invalid token");
  }
}
