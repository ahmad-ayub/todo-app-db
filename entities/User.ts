import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum Type {
  user,
  admin,
}

@Entity()
export default class User {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column("text")
  public email: string;

  @Column("text", { select: false })
  public password: string;

  @Column({
    default: "user",
    type: "varchar",
  })
  public userType: string;
}
