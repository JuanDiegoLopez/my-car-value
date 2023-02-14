import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '../models/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const users: User[] = [];

    const fakeUsersService: Partial<UsersService> = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 10),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeDefined();
  });

  it('should create a new user with a salted and hashed password', async () => {
    const testEmail = 'test@test.com';
    const testPassword = '1234';

    const user = await authService.signup(testEmail, testPassword);
    const [salt, hash] = user.password.split('.');

    expect(user.password).toBeDefined();
    expect(user.password).not.toEqual(testPassword);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if users signs up with an email already in use', async () => {
    const testEmail = 'test@test.com';
    const testPassword = '1234';
    await authService.signup(testEmail, testPassword);

    try {
      await authService.signup(testEmail, testPassword);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('Email already in use');
    }
  });

  it('should throw an error if user signs in with an unused email', async () => {
    const testEmail = 'test@test.com';
    const testPassword = '1234';

    try {
      await authService.signin(testEmail, testPassword);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('No user found with the email provided');
    }
  });

  it('should throw an error if password is invalid', async () => {
    const testEmail = 'test@test.com';
    const testPassword = '1234';

    await authService.signup(testEmail, testPassword);

    try {
      await authService.signin(testEmail, 'asd');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toEqual('Password or email invalid');
    }
  });

  it('should return a user if correct password is provided', async () => {
    const testEmail = 'test@test.com';
    const testPassword = '1234';
    await authService.signup(testEmail, testPassword);

    const user = await authService.signin(testEmail, testPassword);

    expect(user).toBeDefined();
  });
});
