import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      /** DEV ONLY OPTION! NOT FOR PROD SINCE DB SCHEMA CAN BE AUTO-CREATED ON EACH APP LAUNCH!!
       * When an Entity is updated, this flag if TRUE, lets typeORM to update the DB schema.
       * It can DELETE a column as well if removed from Entity!!
       * Use cautiously and for initial DB structure only when in still in DEVELOPMENT!!
       *
       * If this flag is FALSE, then a migration SQL script has to be created to update/change the DB structure manually.
       */
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
