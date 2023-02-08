import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/signup')
  signUp(@Body() body: any) {
    return body;
  }

  @Post('/singin')
  singIn(@Body() body: any) {
    return body;
  }
}
