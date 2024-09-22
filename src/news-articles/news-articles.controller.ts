import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { NewsArticlesService } from './news-articles.service';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { NewsArticle } from './entities/news-article.entity';
import { User } from 'src/auth/user.entity';
import { filterDto } from './dto/get-news-article.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('news-articles')
@Controller('news-articles')
export class NewsArticlesController {
  constructor(private readonly newsArticlesService: NewsArticlesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new News Article' })
  @ApiResponse({
    status: 201,
    description: 'News article successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateNewsArticleDto })
  createNewsArticle(
    @Body() createNewsArticleDto: CreateNewsArticleDto,
    @GetUser() user: User,
  ): Promise<NewsArticle> {
    return this.newsArticlesService.createNewsArticle(
      createNewsArticleDto,
      user,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all News Articles' })
  @ApiResponse({
    status: 200,
    description: 'All news articles retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getNewsArticles(
    @Query() newsarticlefilter: filterDto,
  ): Promise<NewsArticle[]> {
    return this.newsArticlesService.getNewsArticles(newsarticlefilter);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get News Article By ID' })
  @ApiResponse({
    status: 200,
    description: 'News article retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getNewsArticleById(@Param('id') id: string): Promise<NewsArticle> {
    return this.newsArticlesService.getNewsArticleById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update News Article By ID' })
  @ApiResponse({
    status: 200,
    description: 'News article successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: UpdateNewsArticleDto })
  updateNewsArticle(
    @Param('id') id: string,
    @Body() updateNewsArticleDto: UpdateNewsArticleDto,
    @GetUser() user: User,
  ): Promise<NewsArticle> {
    return this.newsArticlesService.updateNewsArticle(
      id,
      updateNewsArticleDto,
      user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete News Article By ID' })
  @ApiResponse({
    status: 200,
    description: 'News article successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  deleteNewsArticle(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<string> {
    return this.newsArticlesService.deleteNewsArticle(id, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pictures/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Add Event Pictures' })
  @ApiConsumes('multipart/form-data') // Specify file upload
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  }) // Swagger body for file upload
  @ApiResponse({
    status: 201,
    description: 'News Article pictures have been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FilesInterceptor('files')) // Use FilesInterceptor for multiple file upload
  async addPictures(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[], // Expect an array of files
    @GetUser() user: User,
  ) {
    return this.newsArticlesService.addPictures(id, files, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/pictures/:newsArticleId/:fileId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete News Article Picture' })
  async deletePicture(
    @Param('newsId') newsArticleId: string,
    @Param('fileId') fileId: string,
    @GetUser() user: User,
  ) {
    return this.newsArticlesService.deletePicture(newsArticleId, fileId, user);
  }
}
