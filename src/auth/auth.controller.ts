import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  @Get('/getuser')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get User' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getNewsArticleById(@GetUser() user: User): Promise<User> {
    return this.authService.getUserById(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('avatar')
  @ApiBearerAuth('JWT')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data') // Specify file upload
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
  }) // Swagger body for file upload
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

  @UseGuards(AuthGuard('jwt'))
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
