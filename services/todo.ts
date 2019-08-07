import { FindConditions, getConnection } from "typeorm";
import Todo from "../entities/Todo";

export async function list(offset: number, limit: number, userId: number): Promise<[number, any[]]> {
  const todoRepo = getConnection().getRepository(Todo);

  const [ rows, count ] = await todoRepo.findAndCount({
    skip: offset,
    take: limit,
    where: {
      userId,
    },
  });

  return [count, rows];
}

export  function create(title: string, description: string, userId: number) {
  const todoRepo = getConnection().getRepository(Todo);
  const todo = new Todo();
  todo.title = title;
  todo.description = description;
  todo.userId = userId;
  return todoRepo.save(todo);
}

export  function update(id: number, title: string, description: string): Promise<Todo> {
  const todoRepo = getConnection().getRepository(Todo);
  return todoRepo.save({
    description,
    id,
    title,
  });
}

export function del(id: number) {
  const todoRepo = getConnection().getRepository(Todo);
  return todoRepo.delete(id);
}

export function findById(id: number, userId?: number) {
  const todoRepo = getConnection().getRepository(Todo);

  const where: FindConditions<Todo> = {
    id,
  };

  if (userId !== undefined) {
    where.userId = userId;
  }

  return todoRepo.findOne({
    where,
  });
}
