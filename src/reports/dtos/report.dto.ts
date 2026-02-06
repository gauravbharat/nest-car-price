/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  currency: string;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  city: string;

  @Expose()
  country: string;

  @Expose()
  mileage: number;

  // Take the Report entity (obj) and only return the user's ID
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  @Transform(({ obj }) => obj?.user?.id)
  @Expose()
  userId: number;
}
