import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewsArticleDto } from './dto/create-news-article.dto';
import { UpdateNewsArticleDto } from './dto/update-news-article.dto';
import { NewsArticle } from './entities/news-article.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class NewsArticlesService {
  constructor(
    @InjectRepository(NewsArticle)
    private newsArticleRepository: Repository<NewsArticle>,
  ) {}

  async createNewsArticle(
    createNewsArticleDto: CreateNewsArticleDto,
    user: User,
  ): Promise<NewsArticle> {
    const { title, content, image, user_id } = createNewsArticleDto;

    // Ensure the user_id matches the user making the request
    if (user.id !== user_id) {
      throw new NotFoundException('User not authorized to create this article.');
    }

    const newsArticle = this.newsArticleRepository.create({
      title,
      content,
      image,
      user,
    });

    await this.newsArticleRepository.save(newsArticle);
    return newsArticle;
  }

  async getNewsArticles(): Promise<NewsArticle[]> {
    return await this.newsArticleRepository.find();
  }

  async getNewsArticleById(id: string): Promise<NewsArticle> {
    const newsArticle = await this.newsArticleRepository.findOne({ where: { id } });
    
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

    const newsArticle = await this.newsArticleRepository.findOne({ where: { id, user } });

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
