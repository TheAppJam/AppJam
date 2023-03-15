import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsController } from 'src/controllers/apps/apps.controller';
import { App } from 'src/entities/app.entity';
import {DataQuery} from 'src/entities/data_query.entity';
import { User } from 'src/entities/user.entity';
import { AppsService } from 'src/services/apps.services';
import { AuthService } from 'src/services/auth.servcies';
import { UsersService } from 'src/services/users.services';

@Module({
  imports: [TypeOrmModule.forFeature([
    App,
    DataQuery,
    User
  ])],
  controllers: [AppsController],
  providers: [AppsService, AuthService, UsersService, JwtService]
})
export class AppsModule {}
