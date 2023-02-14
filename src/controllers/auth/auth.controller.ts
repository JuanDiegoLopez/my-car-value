import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Serialize } from '../../decorators/serialize.decorator';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UserDto } from '../../dtos/user.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../models/user.entity';
import { AuthService } from '../../services/auth.service';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async register(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async login(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
}
