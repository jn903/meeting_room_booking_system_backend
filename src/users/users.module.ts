import { Module } from '@nestjs/common';
import { TypeOrmModule  } from '@nestjs/typeorm';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { User } from'./entities/user.entity.js';
import { Role } from'./entities/role.entity.js';
import { Permission} from'./entities/permission.entity.js';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  controllers: [
    UsersController,
  ],
  providers: [
    UsersService
  ],
})
export class UsersModule {}
