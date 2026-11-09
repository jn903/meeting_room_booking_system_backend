import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module.js';
import { User } from './users/entities/user.entity.js';
import { Role } from './users/entities/role.entity.js';
import { Permission } from './users/entities/permission.entity.js';
import { RedisModule } from './redis/redis.module.js';
import { EmailModule } from './email/email.module.js';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard.js';
import { PermissionGuard } from './permission.guard.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: "mysql",
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: true,
          entities: [
            User, Role, Permission
          ],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          }
        }
      },
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m'
          }
        }
      },
      inject: [ConfigService]
    }),

    UsersModule,
    RedisModule,
    EmailModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    }
  ],
})
export class AppModule { }
