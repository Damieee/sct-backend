import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { FilesService } from 'src/files/files.service';
import { SigninCredentialsDto } from './dto/signin-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private fileService: FilesService,
  ) {}

  async signUp(CreateUserDto: SignupCredentialsDto): Promise<User> {
    const { email, full_name, password } = CreateUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      id: uuid(),
      full_name: full_name,
      email: email,
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
    SignupCredentialsDto: SigninCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = SignupCredentialsDto;
    const user = await this.usersRepository.findOneBy({ email: email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
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
      await this.usersRepository.update(user.id, {
        ...user,
        avatar: null,
      });
      await this.fileService.deletePublicFile(user.avatar.id);
    }
    const avatar = await this.fileService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    await this.usersRepository.update(user.id, {
      ...user,
      avatar,
    });
    return avatar;
  }

  async deleteAvatar(user: User): Promise<void> {
    if (user.avatar) {
      // Remove the avatar from the user entity
      await this.usersRepository.update(user.id, {
        ...user,
        avatar: null,
      });

      // Delete the avatar file from the storage (e.g., S3)
      await this.fileService.deletePublicFile(user.avatar.id);
    } else {
      throw new NotFoundException('User does not have an avatar to delete.');
    }
  }
}
