import { Module } from '@nestjs/common';
import { NewsArticlesService } from './news-articles.service';
import { NewsArticlesController } from './news-articles.controller';

@Module({
  controllers: [NewsArticlesController],
  providers: [NewsArticlesService],
})
export class NewsArticlesModule {}
