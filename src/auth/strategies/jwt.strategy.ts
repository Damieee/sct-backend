import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../jwt-payload.interface';
import { User } from '../user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const user: User = await this.userRepository.findOneBy({
      id: payload.sub,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
