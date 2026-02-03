import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    cookieSession({
      // used to encrypt the information stored inside a cookie
      keys: ['garydsouza'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      // Filters out any properties/keys from the body
      // that DO NOT have any validation decorators in the DTO
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3333);
}
void bootstrap();
