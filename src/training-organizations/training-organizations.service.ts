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
import { RatingRepository } from './training-organization.repository';
import { RateTrainingOrganizationDto } from './dto/rating.dto';
@Injectable()
export class TrainingOrganizationsService {
  constructor(
    @InjectRepository(TrainingOrganizationRepository)
    @InjectRepository(RatingRepository)
    private ratingRepository: RatingRepository,
    private trainingOrganizationRepository: TrainingOrganizationRepository,
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
        'trainingOrganization',
      );

      // Explicitly join the picture relation
      query.leftJoinAndSelect('coworkingspace.picture', 'picture');

      if (search) {
        query.andWhere(
          '(LOWER(trainingOrganization.name) LIKE LOWER(:search) OR LOWER(trainingOrganization.description) LIKE LOWER(:search) OR LOWER(trainingOrganization.location) LIKE LOWER(:search) OR LOWER(trainingOrganization.email) LIKE LOWER(:search))',
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
          where: { id, user },
        });

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

  async rateCoworkingSpace(
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
          { trainingOrganization: { id: trainingOrganizationId }, userId },
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
        trainingOrganization: trainingOrg,
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
}
