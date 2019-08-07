import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./User";

@Entity()
export default class Todo {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column("text")
  public description: string;

  @Column("text")
  public title: string;

  @ManyToOne(() => User)
  public user: User;

  @Column()
  public userId: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
