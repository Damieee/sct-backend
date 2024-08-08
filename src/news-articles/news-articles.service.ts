import { Injectable, NotFoundException } from '@nestjs/common';
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
    const { title, content, image } = createNewsArticleDto;

    const newsArticle = this.newsArticleRepository.create({
      title: title,
      content: content,
      image: image,
      user,
    });

    await this.newsArticleRepository.save(newsArticle);
    return newsArticle;
  }

  async getNewsArticles(newsarticlefilter: filterDto): Promise<NewsArticle[]> {
    const { search } = newsarticlefilter;
    const query = this.newsArticleRepository.createQueryBuilder('newsarticle');

    if (search) {
      query.andWhere(
        '(LOWER(newsarticle.title) LIKE LOWER(:search) OR LOWER(newsarticle.content) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const newsarticle = await query.getMany();
    return newsarticle;
  }

  async getNewsArticleById(id: string): Promise<NewsArticle> {
    const newsArticle = await this.newsArticleRepository.findOne({
      where: { id },
    });

    if (!newsArticle) {
      throw new NotFoundException(`News article with id ${id} not found.`);
    }

    return newsArticle;
  }

  async updateNewsArticle(
    id: string,
    updateNewsArticleDto: UpdateNewsArticleDto,
    user: User,
  ): Promise<NewsArticle> {
    const { title, content, image } = updateNewsArticleDto;

    const newsArticle = await this.newsArticleRepository.findOne({
      where: { id, user },
    });

    if (!newsArticle) {
      throw new NotFoundException(`News article with id ${id} not found.`);
    }

    if (title) newsArticle.title = title;
    if (content) newsArticle.content = content;
    if (image) newsArticle.image = image;

    await this.newsArticleRepository.save(newsArticle);
    return newsArticle;
  }

  async deleteNewsArticle(id: string, user: User): Promise<string> {
    const result = await this.newsArticleRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`News article with id ${id} not found.`);
    }

    return `News article with id ${id} deleted successfully.`;
  }
}
