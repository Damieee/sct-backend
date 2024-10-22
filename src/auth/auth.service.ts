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
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private fileService: FilesService,
  ) {}

  async signUp(
    createUserDto: SignupCredentialsDto,
    isThirdPartyAuth: boolean = false,
  ): Promise<User> {
    const { email, full_name, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = isThirdPartyAuth
      ? await bcrypt.hash(uuid(), salt) // Use a random password for third-party auth
      : await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      id: uuid(),
      full_name,
      email,
      password: hashedPassword,
      isThirdPartyAuth,
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
    isThirdPartyAuth: boolean = false,
  ): Promise<{ accessToken: string }> {
    const { email, password } = signinCredentialsDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (
      user &&
      (isThirdPartyAuth || (await bcrypt.compare(password, user.password)))
    ) {
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

  async changePassword(
    user: User,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // Find the user
    const user_ = await this.usersRepository.findOneBy({ id: user.id });
    if (!user_) {
      throw new NotFoundException('User not found...');
    }
    const { currentPassword, newPassword } = changePasswordDto;
    // Compare the old password with the password in DB
    const passwordMatch = await bcrypt.compare(currentPassword, user_.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
    // Change user's password
    const salt = await bcrypt.genSalt(); // Generate a new salt
    const newHashedPassword = await bcrypt.hash(newPassword, salt); // Hash the new password with the new salt
    user_.password = newHashedPassword;
    await this.usersRepository.save(user_);
    return { message: 'Password changed successfully.' };
  }

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

      return filteredEntities as any;
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
          return filteredEntities;
        })
        .filter((post) => post[entityType].length > 0); // Ensure only posts with matching entities are returned

      return filteredPosts as any;
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

  async findOrCreateUser(
    userDetails: UserDetails,
  ): Promise<{ user: User; accessToken: string }> {
    const { email, full_name, picture } = userDetails;
    let user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      // Use the signUp method for new users
      user = await this.signUp(
        { email, full_name, password: null, passwordConfirm: null }, // Password is not needed for third-party auth
        true, // Indicate third-party authentication
      );
    }

    // Update user's avatar if it doesn't exist
    if (!user.avatar) {
      const avatar = await this.fileService.uploadGoogleUrl(picture);
      await this.usersRepository.update(user.id, { ...user, avatar });
    }

    // Use the signIn method to generate an access token
    const tokens = await this.signIn(
      user.role,
      { email, password: null },
      true,
    );

    return { user, ...tokens };
  }
}
