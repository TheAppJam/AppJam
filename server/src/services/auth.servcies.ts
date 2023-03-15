import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.services';
import { decamelizeKeys } from 'humps';
import { JwtService } from '@nestjs/jwt';
import appConfig from 'src/app.config';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ){}

  async signup(email: string, name: string, password: string) {
    const user = await this.usersService.create(
      {
        email,
        password,
        name
      }
    );
    return await this.generateLoginResultPayload(user)
  }

  async validateUser(email, password) {
    const user = await this.usersService.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return await this.generateLoginResultPayload(user);
  }

  async generateLoginResultPayload(
    user
  ): Promise<any> {
    const JWTPayload = {
      username: user.id,
      sub: user.email,
    };
    
    return decamelizeKeys({
      id: user.id,
      authToken: this.jwtService.sign(JWTPayload, { secret: appConfig().appSecret }),
      email: user.email,
      name: user.name
    });
  }


}