import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NewsArticle } from './entities/news-article.entity';

@Injectable()
export class NewsArticleRepository extends Repository<NewsArticle> {
  constructor(private dataSource: DataSource) {
    super(NewsArticle, dataSource.createEntityManager());
  }
}
