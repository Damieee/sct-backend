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
} from '@nestjs/common';
import { NewsArticlesService } from './news-articles.service';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { NewsArticle } from './entities/news-article.entity';
import { User } from 'src/auth/user.entity';
import { filterDto } from './dto/get-news-article.dto';

@ApiTags('news-articles')
@Controller('news-articles')
@UseGuards(AuthGuard())
export class NewsArticlesController {
  constructor(private readonly newsArticlesService: NewsArticlesService) {}

  @Post()
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

  @Patch('/:id')
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

  @Delete('/:id')
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
}
