import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.servcies';
import { UsersService } from 'src/services/users.services';
import { LocalStrategy } from './local.strategy';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { jwtConfig } from 'src/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [LocalStrategy, AuthService, UsersService, JwtStrategy]
})
export class AuthModule {}
