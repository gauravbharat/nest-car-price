import { Expose } from 'class-transformer';

export class UserDto {
  /** Either @Exclude OR @Expose decorator is required for excludeExtraneousValues property to
   * work in class-transformer's plainToClass func to work!!
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Expose()
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Expose()
  email: string;
}
