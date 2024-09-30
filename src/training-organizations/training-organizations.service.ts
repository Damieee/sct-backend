import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrainingOrganizationDto } from './dto/create-training-organization.dto';
import { UpdateTrainingOrganizationDto } from './dto/update-training-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { TrainingOrganization } from './entities/training-organization.entity';
import { filterDto } from './dto/get-training-organization.dto';
import { TrainingOrganizationRepository } from './training-organizations.repository';
import { RatingRepository } from './training-organization-rating.repository';
import { RateTrainingOrganizationDto } from './dto/rating.dto';
import { FilesService } from 'src/files/files.service';
@Injectable()
export class TrainingOrganizationsService {
  constructor(
    @InjectRepository(TrainingOrganizationRepository)
    private trainingOrganizationRepository: TrainingOrganizationRepository,
    @InjectRepository(RatingRepository)
    private ratingRepository: RatingRepository,
    private fileService: FilesService,
  ) {}

  async createTrainingOrganization(
    createTrainingOrganizationDto: CreateTrainingOrganizationDto,
    user: User,
  ): Promise<TrainingOrganization> {
    const {
      name,
      description,
      location,
      courses,
      logo,
      email,
      opening_hour,
      phone_number,
      website,
    } = createTrainingOrganizationDto;
    const trainingOrganization = this.trainingOrganizationRepository.create({
      name: name,
      description: description,
      location: location,
      courses: courses,
      logo: logo,
      email: email,
      opening_hour: opening_hour,
      phone_number: phone_number,
      website: website,
      user,
    });
    await this.trainingOrganizationRepository.save(trainingOrganization);
    return trainingOrganization;
  }

  async getTrainingOrganizations(
    filterDto: filterDto,
  ): Promise<TrainingOrganization[]> {
    try {
      const { search } = filterDto;
      const query = this.trainingOrganizationRepository.createQueryBuilder(
        'trainingorganization',
      );

      // Explicitly join the picture relation
      query
        .leftJoinAndSelect('trainingorganization.pictures', 'picture')
        .leftJoinAndSelect('trainingorganization.user', 'user');

      if (search) {
        query.andWhere(
          '(LOWER(trainingorganization.name) LIKE LOWER(:search) OR LOWER(trainingorganization.description) LIKE LOWER(:search) OR LOWER(trainingorganization.location::text) LIKE LOWER(:search) OR LOWER(trainingorganization.email) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }

      const trainingOrganizations = await query.getMany();
      return trainingOrganizations;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getTrainingOrganizationById(id: string): Promise<TrainingOrganization> {
    try {
      const trainingOrganization =
        await this.trainingOrganizationRepository.findOne({
          where: { id },
        });

      if (!trainingOrganization) {
        throw new NotFoundException(
          `Could not find training organization with id: ${id}`,
        );
      }
      return trainingOrganization;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTrainingOrganization(
    id: string,
    updateTrainingOrganizationDto: UpdateTrainingOrganizationDto,
    user: User,
  ): Promise<TrainingOrganization> {
    try {
      const trainingOrganization =
        await this.trainingOrganizationRepository.findOne({
          where: { id },
        });

      if (trainingOrganization.user.id != user.id) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      if (!trainingOrganization) {
        throw new NotFoundException(
          `Could not find training organization with id: ${id}`,
        );
      }

      Object.assign(trainingOrganization, updateTrainingOrganizationDto);

      await this.trainingOrganizationRepository.save(trainingOrganization);
      return trainingOrganization;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteTrainingOrganization(id: string, user: User): Promise<string> {
    try {
      const result = await this.trainingOrganizationRepository.delete({
        id,
        user,
      });

      if (result.affected === 0) {
        throw new NotFoundException(
          `Could not find training organization with id: ${id}`,
        );
      }
      return `Training organization with id ${id} deleted successfully`;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async rateTrainingOrganization(
    trainingOrganizationId: string,
    rateTrainingOrganizationDto: RateTrainingOrganizationDto,
    user: User,
  ) {
    try {
      const { rating } = rateTrainingOrganizationDto;
      const userId = user.id;

      if (rating < 1 || rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5.');
      }

      // Check if user has already rated the training organization
      const existingRating = await this.ratingRepository.findOne({
        where: [
          { trainingorganization: { id: trainingOrganizationId }, userId },
        ],
      });

      if (existingRating) {
        throw new Error('You have already rated this Training Organization.');
      }

      // Add new rating
      const trainingOrg = await this.trainingOrganizationRepository.findOne({
        where: { id: trainingOrganizationId },
      });
      if (!trainingOrg) {
        throw new Error('Training Organization not found.');
      }

      const newRating = this.ratingRepository.create({
        trainingorganization: trainingOrg,
        rating,
        userId,
      });

      await this.ratingRepository.save(newRating);

      // Update coworking space average rating
      trainingOrg.totalRatings += rating;
      trainingOrg.ratingsCount += 1;
      trainingOrg.averageRating =
        trainingOrg.totalRatings / trainingOrg.ratingsCount;

      await this.trainingOrganizationRepository.save(trainingOrg);

      return trainingOrg;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addPictures(
    id: string,
    files: Express.Multer.File[], // accept multiple files
    user: User,
  ) {
    const trainingorganization =
      await this.trainingOrganizationRepository.findOne({
        where: { id },
      });
    if (!trainingorganization) {
      throw new NotFoundException(
        `Training Organization with ID ${id} not found`,
      );
    }
    if (trainingorganization.user.id != user.id) {
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
    trainingorganization.pictures = [
      ...trainingorganization.pictures,
      ...uploadedFiles,
    ];
    await this.trainingOrganizationRepository.save(trainingorganization);

    return uploadedFiles;
  }

  async deletePicture(
    trainingOrganizationId: string,
    fileId: string,
    user: User,
  ) {
    const trainingOrganization =
      await this.trainingOrganizationRepository.findOne({
        where: { id: trainingOrganizationId },
      });
    if (!trainingOrganization) {
      throw new NotFoundException(
        `Training Organization with ID ${trainingOrganizationId} not found`,
      );
    }
    if (trainingOrganization.user.id != user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const picture = trainingOrganization.pictures.find(
      (pic) => pic.id === fileId,
    );
    if (!picture) {
      throw new NotFoundException(`Picture not found`);
    }

    // Remove the picture from the array and update the News
    trainingOrganization.pictures = trainingOrganization.pictures.filter(
      (pic) => pic.id !== fileId,
    );
    await this.trainingOrganizationRepository.save(trainingOrganization);

    // Delete the picture from storage
    await this.fileService.deletePublicFile(picture.id);

    return { message: 'Picture deleted successfully' };
  }
}
