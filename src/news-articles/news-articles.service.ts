import { Injectable } from '@nestjs/common';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';

@Injectable()
export class NewsArticlesService {
  create(createNewsArticleDto: CreateNewsArticleDto) {
    return 'This action adds a new newsArticle';
  }

  findAll() {
    return `This action returns all newsArticles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} newsArticle`;
  }

  update(id: number, updateNewsArticleDto: UpdateNewsArticleDto) {
    return `This action updates a #${id} newsArticle`;
  }

  remove(id: number) {
    return `This action removes a #${id} newsArticle`;
  }
}
