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
import { FilesService } from 'src/files/files.service';
import { Status } from 'src/enums/status.enum';

@Injectable()
export class NewsArticlesService {
  constructor(
    @InjectRepository(NewsArticleRepository)
    private newsArticleRepository: NewsArticleRepository,
    private readonly fileService: FilesService,
  ) {}

  async createNewsArticle(
    createNewsArticleDto: CreateNewsArticleDto,
    user: User,
  ): Promise<NewsArticle> {
    try {
      const { title, content, category } = createNewsArticleDto;

      const newsArticle = this.newsArticleRepository.create({
        title: title,
        content: content,
        category,
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
      const { search, category } = newsarticlefilter;
      const query =
        this.newsArticleRepository.createQueryBuilder('newsarticle');

      // Explicitly join the picture relation
      query
        .leftJoinAndSelect('newsarticle.pictures', 'picture')
        .leftJoinAndSelect('newsarticle.user', 'user');
      if (search) {
        query.andWhere(
          '(LOWER(newsarticle.title) LIKE LOWER(:search) OR LOWER(newsarticle.content) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }
      if (category) {
        query.andWhere(
          '(LOWER(newsarticle.category::text) LIKE LOWER(:category))',
          { category: `%${category}%` },
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
        where: { id },
      });
      if (!newsarticle) {
        throw new NotFoundException(`News Article with ID ${id} not found`);
      }
      if (!user) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      Object.assign(newsarticle, updateNewsArticleDto);
      newsarticle.status = Status.PENDING;
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
  async addPictures(
    id: string,
    files: Express.Multer.File[], // accept multiple files
    user: User,
  ) {
    const newsArticle = await this.newsArticleRepository.findOne({
      where: { id },
    });
    if (!newsArticle) {
      throw new NotFoundException(`News Article with ID ${id} not found`);
    }
    if (newsArticle.user.id != user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // Iterate over the uploaded files, and add each to the File entity
    const uploadedFiles = [];
    for (const file of files) {
      const uploadedFile = await this.fileService.uploadPublicFile(
        file.buffer,
        file.originalname,
      );
      uploadedFiles.push(uploadedFile);
    }

    // Append the newly uploaded files to the existing pictures
    newsArticle.pictures = [...newsArticle.pictures, ...uploadedFiles];
    await this.newsArticleRepository.save(newsArticle);

    return uploadedFiles;
  }

  async deletePicture(newsId: string, fileId: string, user: User) {
    const news = await this.newsArticleRepository.findOne({
      where: { id: newsId },
    });
    if (!news) {
      throw new NotFoundException(`News Article with ID ${newsId} not found`);
    }
    if (news.user.id != user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const picture = news.pictures.find((pic) => pic.id === fileId);
    if (!picture) {
      throw new NotFoundException(`Picture not found`);
    }

    // Remove the picture from the array and update the News
    news.pictures = news.pictures.filter((pic) => pic.id !== fileId);
    await this.newsArticleRepository.save(news);

    // Delete the picture from storage
    await this.fileService.deletePublicFile(picture.id);

    return { message: 'Picture deleted successfully' };
  }
}
