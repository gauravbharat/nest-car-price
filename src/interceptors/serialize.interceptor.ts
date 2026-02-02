import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { ClassConstructor } from 'src/models/app.model';

// New decorator to shorten the call/usage
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // console.log('REQUEST context before', context.getArgs());

    return next.handle().pipe(
      map((data) => {
        if (data) {
          // Convert response object to the passed DTO structure to ONLY return allowed object properties
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
          return plainToClass(this.dto, data, {
            excludeExtraneousValues: true,
          });
        }

        // console.log('RESPONSE data after', data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
      }),
    );
  }
}
