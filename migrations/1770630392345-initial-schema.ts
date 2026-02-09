import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1770630392345 implements MigrationInterface {
  name = 'InitialSchema1770630392345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (false), "price" integer NOT NULL, "currency" varchar NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "city" varchar NOT NULL, "country" varchar NOT NULL, "mileage" integer NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL DEFAULT (false))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (false), "price" integer NOT NULL, "currency" varchar NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "city" varchar NOT NULL, "country" varchar NOT NULL, "mileage" integer NOT NULL, "userId" integer, CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_report"("id", "approved", "price", "currency", "make", "model", "year", "city", "country", "mileage", "userId") SELECT "id", "approved", "price", "currency", "make", "model", "year", "city", "country", "mileage", "userId" FROM "report"`,
    );
    await queryRunner.query(`DROP TABLE "report"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_report" RENAME TO "report"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "report" RENAME TO "temporary_report"`,
    );
    await queryRunner.query(
      `CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "approved" boolean NOT NULL DEFAULT (false), "price" integer NOT NULL, "currency" varchar NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "city" varchar NOT NULL, "country" varchar NOT NULL, "mileage" integer NOT NULL, "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "report"("id", "approved", "price", "currency", "make", "model", "year", "city", "country", "mileage", "userId") SELECT "id", "approved", "price", "currency", "make", "model", "year", "city", "country", "mileage", "userId" FROM "temporary_report"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_report"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "report"`);
  }
}
