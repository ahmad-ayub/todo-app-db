import { createConnection } from "typeorm";

export function connect() {
  const conn = createConnection({
    database: "postgres",
    entities: [
      "./entities/*.ts",
    ],
    host: "localhost",
    logging: true,
    password: "docker",
    port: 5432,
    synchronize: true,
    type: "postgres",
    username: "postgres",
  });

  return conn;
}
