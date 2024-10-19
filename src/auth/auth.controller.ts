import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
  Query,
  Param,
} from '@nestjs/common';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { GetUser } from './get-user.decorator';
import { SigninCredentialsDto } from './dto/signin-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from './user.entity';
import { RoleValidationPipe } from './role.validation';
import { Status } from 'src/enums/status.enum';
import { EntityType } from './entity-type.enum';
import { GetUserEntityDetailsDto } from './dto/get-user-entity-details.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: SignupCredentialsDto })
  signUp(@Body() SignupCredentialsDto: SignupCredentialsDto): Promise<User> {
    return this.authService.signUp(SignupCredentialsDto);
  }

  @Post('/:role/signin')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully signed in.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({
    name: 'role',
    enum: UserRole,
    required: true,
    description: 'The role of the user to sign in.',
  })
  @ApiBody({ type: SigninCredentialsDto })
  signIn(
    @Param('role', RoleValidationPipe) role: UserRole,
    @Body() signinCredentialsDto: SigninCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(role, signinCredentialsDto);
  }
  //   @Post('forgot-password')
  //   @HttpCode(HttpStatus.OK)
  //   @ApiOperation({ summary: 'Request a password reset' })
  //   @ApiResponse({ status: 200, description: 'Password reset link has been sent.' })
  //   @ApiResponse({ status: 404, description: 'User not found.' })
  //   @ApiBody({ type: ForgotPasswordDto })
  //   async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  //     return this.authService.forgotPassword(forgotPasswordDto);
  //   }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  @Get('/get-user-details')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get User' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getUser(@GetUser() user: User): Promise<User> {
    return this.authService.getUserDetails(user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  @Get('/entities/:entityType/:status')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get User Details' })
  @ApiResponse({
    status: 200,
    description: 'User details retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiQuery({
    name: 'entityType',
    enum: EntityType,
    required: true,
    description: 'The type of entity to retrieve details for.',
  })
  @ApiQuery({
    name: 'status',
    enum: Status,
    required: true,
    description: 'The status of the entity to retrieve details for.',
  })
  async getUserEntityDetails(
    @GetUser() user: User,
    @Query('entityType') entityType: EntityType,
    @Query('status') status: Status,
  ) {
    const getUserEntityDetailsDto: GetUserEntityDetailsDto = {
      entityType,
      status,
    };
    return this.authService.getUserEntityDetails(user, getUserEntityDetailsDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('/admin/entities/:entityType/:status')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get entity details by type and status' })
  @ApiResponse({
    status: 200,
    description: 'Entity details retrieved successfully.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Entity not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiQuery({
    enum: EntityType,
    name: 'entityType',
    required: true,
    description: 'Type of the entity to retrieve',
  })
  @ApiQuery({
    enum: Status,
    name: 'status',
    required: true,
    description: 'Status of the entity to filter by',
  })
  async fetchAllUserEntities(
    @Query('entityType') entityType: EntityType,
    @Query('status') status: Status,
  ): Promise<User[]> {
    try {
      const getUserEntityDetailsDto: GetUserEntityDetailsDto = {
        entityType,
        status,
      };
      return await this.authService.getEntityDetailsForAdmin(
        getUserEntityDetailsDto,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  @Post('avatar')
  @ApiBearerAuth('JWT')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async addAvatar(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!user) {
      throw new HttpException('No user found', HttpStatus.BAD_REQUEST);
    }
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    return this.authService.addAvatar(user, file.buffer, file.originalname);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  @Delete('/avatar')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete User Avatar' })
  @ApiResponse({
    status: 200,
    description: 'Avatar successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Avatar not found.' })
  @ApiResponse({ status: 403, description: 'Unauthorized to delete avatar.' })
  async deleteAvatar(@GetUser() user: User) {
    await this.authService.deleteAvatar(user);
    return {
      statusCode: 200,
      message: 'Avatar successfully deleted.',
    };
  }
}
