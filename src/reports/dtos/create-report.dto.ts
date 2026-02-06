/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNumber,
  IsString,
  Min,
  Max,
  MaxLength,
  IsPositive,
} from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @MaxLength(3)
  currency: string;

  @IsString()
  make: string; // Honda, Hyundai, etc.

  @IsString()
  model: string; // Civic, Accord, Verna, etc.

  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear())
  year: number;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsNumber()
  @Min(0)
  @Max(1000000) // max a million miles run
  mileage: number; // odometer kms
}
