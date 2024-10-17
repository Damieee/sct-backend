import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilesService } from 'src/files/files.service';
import { FileRepository } from 'src/files/files.repository';
import { EventLikeRepository } from 'src/events/event-like.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION_TIME'),
          },
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    TypeOrmModule.forFeature([User]),
    ConfigModule,
  ],
  providers: [
    AuthService,
    UsersRepository,
    EventLikeRepository,
    JwtStrategy,
    FilesService,
    FileRepository,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
