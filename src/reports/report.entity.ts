import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  currency: string; //currency code INR, USD, etc.

  @Column()
  make: string; // Honda, Hyundai, etc.

  @Column()
  model: string; // Civic, Accord, Verna, etc.

  @Column()
  year: number; //manufacture year

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  mileage: number; // odometer kms

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
