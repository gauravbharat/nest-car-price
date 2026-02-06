import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string; // Honda, Hyundai, etc.

  @Column()
  model: string; // Civic, Accord, Verna, etc.

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  mileage: number; // odometer kms
}
