import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';
import { NewsArticle } from './entities/news-article.entity';
import { User } from 'src/auth/user.entity';
import { filterDto } from './dto/get-news-article.dto';
import { NewsArticleRepository } from './news-article.repository';

@Injectable()
export class NewsArticlesService {
  constructor(
    @InjectRepository(NewsArticleRepository)
    private newsArticleRepository: NewsArticleRepository,
  ) {}

  async createNewsArticle(
    createNewsArticleDto: CreateNewsArticleDto,
    user: User,
  ): Promise<NewsArticle> {
    try {
      const { title, content, category, image } = createNewsArticleDto;

      const newsArticle = this.newsArticleRepository.create({
        title: title,
        content: content,
        category,
        image: image,
        user,
      });

      await this.newsArticleRepository.save(newsArticle);
      return newsArticle;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getNewsArticles(newsarticlefilter: filterDto): Promise<NewsArticle[]> {
    try {
      const { search } = newsarticlefilter;
      const query =
        this.newsArticleRepository.createQueryBuilder('newsarticle');

      if (search) {
        query.andWhere(
          '(LOWER(newsarticle.title) LIKE LOWER(:search) OR LOWER(newsarticle.category::text) LIKE LOWER(:search) OR LOWER(newsarticle.content) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }

      const newsarticle = await query.getMany();
      return newsarticle;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getNewsArticleById(id: string): Promise<NewsArticle> {
    try {
      const newsArticle = await this.newsArticleRepository.findOne({
        where: { id },
      });

      if (!newsArticle) {
        throw new NotFoundException(`News article with id ${id} not found.`);
      }

      return newsArticle;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateNewsArticle(
    id: string,
    updateNewsArticleDto: UpdateNewsArticleDto,
    user: User,
  ): Promise<NewsArticle> {
    try {
      const newsarticle = await this.newsArticleRepository.findOne({
        where: { id, user },
      });
      if (!newsarticle) {
        throw new NotFoundException(`News Article with ID ${id} not found`);
      }
      Object.assign(newsarticle, updateNewsArticleDto);
      await this.newsArticleRepository.save(newsarticle);
      return newsarticle;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteNewsArticle(id: string, user: User): Promise<string> {
    try {
      const result = await this.newsArticleRepository.delete({ id, user });

      if (result.affected === 0) {
        throw new NotFoundException(`News article with id ${id} not found.`);
      }

      return `News article with id ${id} deleted successfully.`;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
