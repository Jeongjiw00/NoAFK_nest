import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Users } from '../../src/entities/users.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from '../../src/config/typeorm.config.service';
import { AuthModule } from '../../src/auth/auth.module';
import { JwtConfigService } from '../../src/config/jwt.config.service';
import { Repository } from 'typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from '../../src/config/redis.config.service';
import { UsersModule } from './users.module';

describe.skip('UsersService', () => {
  let userService: UsersService;

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  type MockRepository<T = any> = Partial<
    Record<keyof Repository<T>, jest.Mock>
  >;

  let userRepository: MockRepository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: TypeOrmConfigService,
          inject: [ConfigService],
        }),
        RedisModule.forRootAsync({
          imports: [ConfigModule],
          useClass: RedisConfigService,
          inject: [ConfigService],
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useClass: JwtConfigService,
          inject: [ConfigService],
        }),
        UsersModule,
        AuthModule,
      ],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository<Users>>(
      getRepositoryToken(Users),
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should defined', async () => {
      await userService.findAllUsers();

      expect(userService.findAllUsers).toBeDefined();
    });
  });

  describe('findExistUser', () => {
    it('should defined', async () => {
      await userService.findExistUser({ email: 'test' });

      expect(userService.findExistUser).toBeDefined();
    });

    it('should throw 404 error by findExistUser', async () => {
      try {
        await userService.findExistUser({ email: 'test99@gmail.com' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findUserByUserId', () => {
    it('should defined', async () => {
      await userService.findUserByUserId(1);

      expect(userService.findUserByUserId).toBeDefined();
    });

    it('should throw 404 error by findUserByUserId', async () => {
      try {
        await userService.findUserByUserId(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('signUp', () => {
    const createArgs = {
      email: 'test',
      password: 'testPassword!',
      nickname: 'test',
    };

    it('should fail on exception', async () => {
      try {
        await userService.signUp(createArgs);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('findUser', () => {
    it('should defined', async () => {
      await userService.findUser('test');

      expect(userService.findUser).toBeDefined();
    });

    it('should throw 404 error by findUser', async () => {
      try {
        await userService.findUser('test99@gmail.com');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('createAccessToken', () => {
    it('should defined', async () => {
      await userService.createAccessToken(1);

      expect(userService.createAccessToken).toBeDefined();
    });
  });

  describe('createRefreshToken', () => {
    it('should defined', async () => {
      await userService.createAccessToken(1);

      expect(userService.createAccessToken).toBeDefined();
    });
  });

  describe('signInUser', () => {
    it('should defined', async () => {
      let userInfo = { email: 'test', password: 'testPassword!' };
      await userService.signInUser(userInfo);

      expect(userService.signInUser).toBeDefined();
    });
  });

  describe('updateUserProfile', () => {
    let userInfo = {
      nickname: 'test',
      email: null,
      password: null,
      introduction: null,
    };

    it('should throw 404 error by updateUserProfile', async () => {
      try {
        await userService.updateUserProfile(1, userInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });
});
