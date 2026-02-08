/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumber, IsString, Min, Max, IsOptional } from 'class-validator';

import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  make: string; // Honda, Hyundai, etc.

  @IsString()
  model: string; // Civic, Accord, Verna, etc.

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear())
  year: number;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000) // max a million miles run
  mileage: number; // odometer kms
}
