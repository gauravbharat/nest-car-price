import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';

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
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          /** DEV ONLY OPTION! NOT FOR PROD SINCE DB SCHEMA CAN BE AUTO-CREATED ON EACH APP LAUNCH!!
           * When an Entity is updated, this flag if TRUE, lets typeORM to update the DB schema.
           * It can DELETE a column as well if removed from Entity!!
           * Use cautiously and for initial DB structure only when in still in DEVELOPMENT!!
           *
           * If this flag is FALSE, then a migration SQL script has to be created to update/change the DB structure manually.
           */
          synchronize: true,
        };
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
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
        cookieSession({
          // used to encrypt the information stored inside a cookie
          keys: ['garydsouza'],
        }),
      )
      .forRoutes('*');
  }
}
