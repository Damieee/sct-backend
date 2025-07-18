import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
import { Startup } from './entities/startup.entity';
import { User } from 'src/auth/user.entity';
import { StartupRepository } from './startups.repository';
import { RatingRepository } from './startup-rating.repository';
import { RateStartupDto } from './dto/startup-rating.dto';
import { filterDto } from './dto/get-startup.dto';
import { FilesService } from 'src/files/files.service';
import { Status } from 'src/enums/status.enum';
import { AdminUpdateStartupDto } from './dto/admin-update-startup.dto';

@Injectable()
export class StartupsService {
  constructor(
    @InjectRepository(StartupRepository)
    private readonly startupRepository: StartupRepository,
    @InjectRepository(RatingRepository)
    private readonly ratingRepository: RatingRepository,
    private fileService: FilesService,
  ) {}

  async createStartup(
    createStartupDto: CreateStartupDto,
    user: User,
  ): Promise<Startup> {
    try {
      const { name, description, tags, category, information, location, logo } =
        createStartupDto;
      const startup = this.startupRepository.create({
        name,
        description,
        tags,
        logo,
        category,
        information,
        location,
        user,
      });
      await this.startupRepository.save(startup);
      return startup;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getStartups(startupfilter: filterDto): Promise<Startup[]> {
    try {
      const { search } = startupfilter;
      const query = this.startupRepository.createQueryBuilder('startup');

      // Explicitly join the picture relation
      query
        .leftJoinAndSelect('startup.pictures', 'picture')
        .leftJoinAndSelect('startup.user', 'user');
      query.where('startup.status = :status', {
        status: Status.APPROVED,
      });

      if (search) {
        query.andWhere(
          '(LOWER(startup.name) LIKE LOWER(:search) OR LOWER(startup.description) LIKE LOWER(:search) OR LOWER(startup.category::text) LIKE LOWER(:search) OR LOWER(startup.information::text) LIKE LOWER(:search) OR LOWER(startup.location::text) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }

      const startup = await query.getMany();
      return startup;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getStartupById(id: string): Promise<Startup> {
    try {
      const startup = await this.startupRepository.findOne({ where: { id } });
      if (!startup) {
        throw new NotFoundException(`Could not find startup with ID ${id}`);
      }
      return startup;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateStartup(
    id: string,
    updateStartupDto: UpdateStartupDto,
    user: User,
  ): Promise<Startup> {
    try {
      const startup = await this.startupRepository.preload({
        id: id,
        ...updateStartupDto,
        user,
      });

      if (!startup) {
        throw new NotFoundException(`Could not find startup with ID ${id}`);
      }
      startup.status = Status.PENDING;
      return this.startupRepository.save(startup);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteStartup(id: string, user: User): Promise<string> {
    try {
      const result = await this.startupRepository.delete({ id, user });
      if (result.affected === 0) {
        throw new NotFoundException(`Could not find startup with ID ${id}`);
      }
      return `Startup with ID ${id} deleted successfully`;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async rateStartup(
    startupId: string,
    rateStartupDto: RateStartupDto,
    user: User,
  ) {
    try {
      const { rating, review } = rateStartupDto;
      const userId = user.id;

      if (rating < 1 || rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5.');
      }

      // Check if user has already rated the coworking space
      const existingRating = await this.ratingRepository.findOne({
        where: [{ startup: { id: startupId }, userId }],
      });

      if (existingRating) {
        throw new Error('You have already rated this Startup.');
      }

      // Add new rating
      const startup = await this.startupRepository.findOne({
        where: { id: startupId },
      });
      if (!startup) {
        throw new Error('Startup not found.');
      }

      const newRating = this.ratingRepository.create({
        startup,
        rating,
        review,
        userId,
      });

      await this.ratingRepository.save(newRating);

      // Update coworking space average rating
      startup.totalRatings += rating;
      startup.ratingsCount += 1;
      startup.averageRating = startup.totalRatings / startup.ratingsCount;

      await this.startupRepository.save(startup);

      return startup;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getStartupRatingAndReviews(startupId: string) {
    try {
      const ratings = await this.ratingRepository.find({
        where: { startup: { id: startupId } },
        relations: ['startup'],
      });

      const averageRating =
        ratings.reduce((sum, rating) => sum + rating.rating, 0) /
        ratings.length;

      return {
        ratings,
        averageRating: isNaN(averageRating) ? 0 : averageRating,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addPictures(
    id: string,
    files: Express.Multer.File[], // accept multiple files
    user: User,
  ) {
    const startup = await this.startupRepository.findOne({
      where: { id },
    });
    if (!startup) {
      throw new NotFoundException(`Startup with ID ${id} not found`);
    }
    if (startup.user.id != user.id) {
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
    startup.pictures = [...startup.pictures, ...uploadedFiles];
    await this.startupRepository.save(startup);

    return uploadedFiles;
  }

  async deletePicture(startupId: string, fileId: string, user: User) {
    const startup = await this.startupRepository.findOne({
      where: { id: startupId },
    });
    if (!startup) {
      throw new NotFoundException(`Startup with ID ${startupId} not found`);
    }
    if (startup.user.id != user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const picture = startup.pictures.find((pic) => pic.id === fileId);
    if (!picture) {
      throw new NotFoundException(`Picture not found`);
    }

    // Remove the picture from the array and update the News
    startup.pictures = startup.pictures.filter((pic) => pic.id !== fileId);
    await this.startupRepository.save(startup);

    // Delete the picture from storage
    await this.fileService.deletePublicFile(picture.id);

    return { message: 'Picture deleted successfully' };
  }

  async adminUpdateStartup(
    id: string,
    adminUpdateDto: AdminUpdateStartupDto,
  ): Promise<Startup> {
    const startup = await this.getStartupById(id);
    if (!startup) {
      throw new NotFoundException(`Could not find startup with id: ${id}`);
    }
    const { status, adminComment } = adminUpdateDto;

    if (status === Status.REJECTED && !adminComment) {
      throw new BadRequestException('A comment is required when rejecting.');
    }

    startup.status = status;
    if (adminComment) {
      startup.adminComment = adminComment;
    }

    await this.startupRepository.save(startup);
    return startup;
  }
}
