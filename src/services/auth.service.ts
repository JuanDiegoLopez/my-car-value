import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);

    if (users.length > 0) {
      throw new BadRequestException('Email already in use');
    }

    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hashed result and the salt together
    const result = `${salt}.${hash.toString('hex')}`;

    return this.usersService.create(email, result);
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('No user found with the email provided');
    }

    const [salt, storedHash] = user.password.split('.');
    const providedHash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== providedHash.toString('hex')) {
      throw new UnauthorizedException('Password or email invalid');
    }

    return user;
  }
}
