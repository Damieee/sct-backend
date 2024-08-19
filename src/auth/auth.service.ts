import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private fileService: FilesService,
  ) {}

  async signUp(CreateUserDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = CreateUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      id: uuid(),
      username: username,
      password: hashedPassword,
    });
    try {
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({ username: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  //   async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
  //     const user = await this.userService.findByEmail(forgotPasswordDto.email);
  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }
  //     // Here is the logic to send a password reset email
  //     // For simplicity, we'll just return a success message
  //     return { message: 'Password reset link has been sent' };
  //   }
  // }

  async addAvatar(user: User, imageBuffer: Buffer, filename: string) {
    if (user.avatar) {
      await this.usersRepository.update(user, {
        ...user,
        avatar: null,
      });
      await this.fileService.deletePublicFile(user.avatar.id);
    }
    const avatar = await this.fileService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    await this.usersRepository.update(user, {
      ...user,
      avatar,
    });
    return avatar;
  }

  // async deleteAvatar(userId: number) {
  //   const user = await this.getById(userId);
  //   const fileId = user.avatar?.id;
  //   if (fileId) {
  //     await this.usersRepository.update(userId, {
  //       ...user,
  //       avatar: null,
  //     });
  //     await this.fileService.deletePublicFile(fileId);
  //   }
  // }
}
