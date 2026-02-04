import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

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
    fakeAuthService = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      signup: (email, password) =>
        Promise.resolve({
          id: testUserId,
          email,
          password: testHashedPassword,
        } as User),
      signin: (email, password) =>
        Promise.resolve({ id: testUserId, email, password } as User),
    };

    fakeUsersService = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      findOne: (id: number) =>
        Promise.resolve(id === testUserId ? testUserData : ({} as User)),
      find: (email: string) =>
        Promise.resolve([{ ...testUserData, email } as User]),
      // remove: () => {},
      // update: () => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUser returns a list of users for the query email or a found user for the query id', async () => {
    const user = (await controller.findUser({
      id: testUserId.toString(),
    })) as User;
    expect(user).toBeDefined();
    expect(user.id).toEqual(testUserId);

    const users = (await controller.findUser({ email: testEmail })) as User[];
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(testEmail);

    await expect(controller.findUser({})).rejects.toThrow(BadRequestException);
  });

  it('findUserById throws when user id is string', async () => {
    await expect(controller.findUserById('invald')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('findUserById returns user for valid user id', async () => {
    const user = await controller.findUserById(testUserId as any);
    expect(user.id).toEqual(testUserId);
  });

  it('findUserById throws when user is not found', async () => {
    await expect(controller.findUserById(2 as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('signup creates a new user with a salted and hashed password', async () => {
    const session = { userId: -10 };
    const user = await controller.createUser(
      {
        email: testEmail,
        password: testPassword,
      },
      session,
    );

    expect(user).toBeDefined();
    expect(session.userId).toEqual(testUserId);
    expect(user.password).not.toEqual(testPassword);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('signin returns a user if correct password is provided', async () => {
    const user = await controller.signin(
      { email: testEmail, password: testPassword },
      {},
    );
    expect(user).toBeDefined();
  });

  it('successful signout', () => {
    const session = { userId: testUserId };
    controller.signout(session);

    expect(session.userId).toBeFalsy();
  });
});
