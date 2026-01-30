import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // typeORM creates a table in the db
export class User {
  @PrimaryGeneratedColumn() // typeORM creates a primary column; INTEGER in this case
  id: number;

  @Column() // typeORM creates a column; VARCHAR in this case
  email: string;

  @Column()
  password: string;
}
