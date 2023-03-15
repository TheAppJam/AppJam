import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './services/auth.servcies';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async signup(@Body() body) {
    return this.authService.signup(body.email, body.name, body.password);
  }

  @Post('/login')
  async login(@Body() body) {
    return this.authService.login(body.email, body.password)
  }

}
