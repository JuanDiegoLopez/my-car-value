import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Serialize } from 'src/decorators/serialize.decorator';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { UserDto } from 'src/dtos/user.dto';
import { UsersService } from '../../services/users.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  async findUser(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Get()
  async findAllUsers(@Query('email') email: string) {
    const users = await this.usersService.find(email);

    if (!users.length) {
      throw new NotFoundException('Users not found with the provided email');
    }

    return users;
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
