import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppsModule } from './modules/apps/apps.module';
import { DataQueriesModule } from './modules/data_queries/data_queries.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'ormconfig';
import { AuthService } from './services/auth.servcies';
import { UsersService } from './services/users.services';
import { User } from './entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AppsModule,
    DataQueriesModule,
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, UsersService, JwtService],
})
export class AppModule {}
