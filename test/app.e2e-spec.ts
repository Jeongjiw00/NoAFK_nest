import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Connection } from 'typeorm';
import { signUpUserDto } from '../src/users/dto/signup-user.dto';
import { signInUserDto } from 'src/users/dto/signin-user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const connection = app.get(Connection);
    await connection.synchronize(true);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    const connection = app.get(Connection);
    await connection.synchronize(true);
    app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('welcome to NoAFK');
  });

  describe('users', () => {
    describe('/api/users/signup - 회원가입', () => {
      it('POST 200', () => {
        const userSignUpInfo: signUpUserDto = {
          email: 'test@gmail.com',
          password: 'test1234!',
          nickname: 'test1234',
        };

        return request(app.getHttpServer())
          .post('/api/users/signup')
          .send(userSignUpInfo)
          .expect(201)
          .expect({ message: '회원가입 성공' });
      });

      it('POST 400', () => {
        const wrongSingUpInfo: object = {
          email: 'test',
        };

        return request(app.getHttpServer())
          .post('/api/users/signup')
          .send(wrongSingUpInfo)
          .expect(400);
      });
    });
  });
});
