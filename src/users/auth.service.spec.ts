import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  const testEmail = 'test@gmail.com';
  const testPassword = '12345';
  const testUserId = 1;
  const testHashedPassword =
    '2eedbb3a82cb71bc.dda5e898dbf3fbb7d930b13353f9745f442e1b7a1535406f4b7d0df4d7014917';

  const testUserData = {
    id: testUserId,
    email: testEmail,
    password: testHashedPassword,
  } as User;

  beforeEach(async () => {
    // Create a fake PARTIAL user service with the methods that AuthService uses!
    fakeUsersService = {
      find: () => Promise.resolve([]),

      create: (email: string, password: string) =>
        Promise.resolve({ id: testUserId, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup(testEmail, testPassword);

    expect(user).toBeDefined();
    expect(user.password).not.toEqual(testPassword);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // email in use
    fakeUsersService.find = () => Promise.resolve([testUserData]);

    await expect(service.signup(testEmail, testPassword)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin(testEmail, testPassword)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    // invalid password
    fakeUsersService.find = () => Promise.resolve([testUserData]);

    await expect(service.signin(testEmail, 'invalid')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    // stored user record
    fakeUsersService.find = () => Promise.resolve([testUserData]);

    const user = await service.signin(testEmail, testPassword);
    expect(user).toBeDefined();
  });
});
