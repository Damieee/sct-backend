import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NewsArticlesService } from './news-articles.service';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';

@Controller('news-articles')
export class NewsArticlesController {
  constructor(private readonly newsArticlesService: NewsArticlesService) {}

  @Post()
  create(@Body() createNewsArticleDto: CreateNewsArticleDto) {
    return this.newsArticlesService.create(createNewsArticleDto);
  }

  @Get()
  findAll() {
    return this.newsArticlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsArticlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsArticleDto: UpdateNewsArticleDto) {
    return this.newsArticlesService.update(+id, updateNewsArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsArticlesService.remove(+id);
  }
}
