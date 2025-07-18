import { Module } from '@nestjs/common';
import { NewsArticlesService } from './news-articles.service';
import { NewsArticlesController } from './news-articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsArticle } from './entities/news-article.entity';
import { AuthModule } from 'src/auth/auth.module';
import { NewsArticleRepository } from './news-article.repository';
import { FilesService } from 'src/files/files.service';
import { FileRepository } from 'src/files/files.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NewsArticle]), AuthModule],
  controllers: [NewsArticlesController],
  providers: [
    NewsArticlesService,
    NewsArticleRepository,
    FilesService,
    FileRepository,
  ],
  exports: [NewsArticlesService],
})
export class NewsArticlesModule {}
