import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { GetUser } from './get-user.decorator';
import { SigninCredentialsDto } from './dto/signin-credentials.dto';

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

  @Post('/signin')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully signed in.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: SigninCredentialsDto })
  signIn(
    @Body() SignupCredentialsDto: SigninCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(SignupCredentialsDto);
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

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.addAvatar(user, file.buffer, file.originalname);
  }
}
