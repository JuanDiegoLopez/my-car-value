import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const testData = {
      email: 'test@test.com',
      password: '1234',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testData)
      .expect(201);

    const { id, email } = response.body;

    expect(id).toBeDefined();
    expect(email).toEqual(testData.email);
  });

  it('singup as new user then get the currently logged user', async () => {
    const testData = {
      email: 'test@test.com',
      password: '1234',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testData)
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(testData.email);
  });
});
