import { Report } from 'src/reports/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity() // typeORM creates a table in the db
export class User {
  @PrimaryGeneratedColumn() // typeORM creates a primary column; INTEGER in this case
  id: number;

  @Column() // typeORM creates a column; VARCHAR in this case
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  // ENTITY HOOKS
  @AfterInsert()
  logInsert() {
    console.log(`Created user with ID ${this.id} and email ${this.email}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user with ID ${this.id} and email ${this.email}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`REMOVED user with ID ${this.id} and email ${this.email}`);
  }
}
