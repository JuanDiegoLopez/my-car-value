import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '../../models/user.entity';
import { UsersService } from '../../services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let usersController: UsersController;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([{} as User]),
      findOne: () => Promise.resolve({} as User),
    };

    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    usersController = module.get(UsersController);
  });

  it('should be created', () => {
    expect(usersController).toBeDefined();
  });

  it('should return a list of users', async () => {
    const testEmail = 'test@test.com';
    const users = await usersController.findAllUsers(testEmail);

    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
  });

  it('should throw an error if there is not users with the email provided', async () => {
    const testEmail = 'test@test.com';
    fakeUsersService.find = () => Promise.resolve([]);

    try {
      await usersController.findAllUsers(testEmail);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toEqual('Users not found with the provided email');
    }
  });
});
