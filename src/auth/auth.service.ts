import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { User, UserRole } from './user.entity';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { FilesService } from 'src/files/files.service';
import { SigninCredentialsDto } from './dto/signin-credentials.dto';
import { UserDetails } from './user-details.interface';
import { GetUserEntityDetailsDto } from './dto/get-user-entity-details.dto';

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
    role: UserRole,
    signinCredentialsDto: SigninCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = signinCredentialsDto;
    const user = await this.usersRepository.findOneBy({ email: email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.role !== role) {
        const roleMessage =
          role === UserRole.ADMIN
            ? 'only for admin'
            : 'not authorized for this role';
        throw new UnauthorizedException(
          `Invalid role: This section is ${roleMessage}.`,
        );
      }
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

  async getUserDetails(user: User): Promise<User> {
    try {
      const user_ = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: [
          'events',
          'trainingOrganizations',
          'coWorkingSpaces',
          'startups',
          'newsArticles',
          'avatar',
          'likedEvents',
          'bookmarkedEvents',
        ],
      });

      if (!user_) {
        throw new NotFoundException(`Could not find user with ID ${user_.id}`);
      }

      return user_;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserEntityDetails(
    user: User,
    getUserEntityDetailsDto: GetUserEntityDetailsDto,
  ): Promise<User> {
    const { entityType, status } = getUserEntityDetailsDto;
    try {
      const relations = [entityType];

      const user_ = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: relations,
      });

      if (!user_) {
        throw new NotFoundException(`Could not find user with ID ${user.id}`);
      }

      // Filter the related entities by status
      const filteredEntities = user_[entityType].filter(
        (entity) => entity.status === status,
      );

      // Ensure the entityType is a valid key of user_ and cast the filteredEntities to the
      user_[entityType as keyof User] = filteredEntities as any;

      return user_;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getEntityDetailsForAdmin(
    getUserEntityDetailsDto: GetUserEntityDetailsDto,
  ): Promise<User[]> {
    // Return an array of Users
    const { entityType, status } = getUserEntityDetailsDto;
    try {
      const relations = [entityType];

      const posts = await this.usersRepository.find({
        relations: relations,
      });

      if (!posts || posts.length === 0) {
        throw new NotFoundException(
          `Could not find any posts for ${relations}`,
        );
      }

      // Filter the related entities by status
      const filteredPosts = posts
        .map((post) => {
          const filteredEntities = post[entityType].filter(
            (entity) => entity.status === status,
          );
          post[entityType as keyof User] = filteredEntities as any;
          return post;
        })
        .filter((post) => post[entityType].length > 0); // Ensure only posts with matching entities are returned

      return filteredPosts;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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
