import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication<App>;
  const email = 'test1.e2e@nest.com';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ GET 404', () => {
    return request(app.getHttpServer()).get('/').expect(404);
    // .expect('Hello World!');
  });

  it('handles a signup request', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: '12345',
      })
      .expect(201)
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body?.id).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(res.body?.email).toEqual(email);
      });
    // .expect('Hello World!');
  });

  it('throws signup request for email in use', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: '12345',
      })
      .expect(400);
  });
});
