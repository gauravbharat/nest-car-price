import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from '../ormconfig';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const cookieSession = require('cookie-session');

/** For e2e, main.ts is not executed and hence it misses on the required cookie session
 * references and the validation pipe checks for incoming API requests.
 *
 * From main.ts -
 * Moved validation pipe initialisation to here to make a Global Validation Pipe provided
 * using APP_PIPE
 *
 * Moved cookie session configuration here to create a global middleware for all incoming
 * API requests
 */

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
          type: AppDataSource.options.type,
          database: AppDataSource.options.database,
          entities: AppDataSource.options.entities,
          synchronize: AppDataSource.options.synchronize,
        } as any;
      },
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // Filters out any properties/keys from the body
        // that DO NOT have any validation decorators in the DTO
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
        cookieSession({
          // used to encrypt the information stored inside a cookie
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
