import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { GetUser } from './get-user.decorator';

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
  @ApiBody({ type: AuthCredentialsDto })
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully signed in.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: AuthCredentialsDto })
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
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
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.addAvatar(user, file.buffer, file.originalname);
  }
}
