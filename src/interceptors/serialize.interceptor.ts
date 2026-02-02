import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { ClassConstructor } from 'src/models/app.model';

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
