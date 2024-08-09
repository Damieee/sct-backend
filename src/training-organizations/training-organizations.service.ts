import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingOrganizationDto } from './dto/create-training-organization.dto';
import { UpdateTrainingOrganizationDto } from './dto/update-training-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { TrainingOrganization } from './entities/training-organization.entity';
import { filterDto } from './dto/get-training-organization.dto';
import { TrainingOrganizationRepository } from './training-organizations.repository';

@Injectable()
export class TrainingOrganizationsService {
  constructor(
    @InjectRepository(TrainingOrganizationRepository)
    private trainingOrganizationRepository: TrainingOrganizationRepository,
  ) {}

  async createTrainingOrganization(
    createTrainingOrganizationDto: CreateTrainingOrganizationDto,
    user: User,
  ): Promise<TrainingOrganization> {
    const { name, description, location, courses, rating, logo, contact_info } =
      createTrainingOrganizationDto;
    const trainingOrganization = this.trainingOrganizationRepository.create({
      name: name,
      description: description,
      location: location,
      courses: courses,
      rating: rating,
      logo: logo,
      contact_info: contact_info,
      user,
    });
    await this.trainingOrganizationRepository.save(trainingOrganization);
    return trainingOrganization;
  }

  async getTrainingOrganizations(
    filterDto: filterDto,
  ): Promise<TrainingOrganization[]> {
    const { search } = filterDto;
    const query = this.trainingOrganizationRepository.createQueryBuilder(
      'trainingOrganization',
    );

    if (search) {
      query.andWhere(
        '(LOWER(trainingOrganization.name) LIKE LOWER(:search) OR LOWER(trainingOrganization.description) LIKE LOWER(:search) OR LOWER(trainingOrganization.location) LIKE LOWER(:search) OR LOWER(trainingOrganization.contact_info) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const trainingOrganizations = await query.getMany();
    return trainingOrganizations;
  }

  async getTrainingOrganizationById(id: string): Promise<TrainingOrganization> {
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
  }

  async updateTrainingOrganization(
    id: string,
    updateTrainingOrganizationDto: UpdateTrainingOrganizationDto,
    user: User,
  ): Promise<TrainingOrganization> {
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
  }

  async deleteTrainingOrganization(id: string, user: User): Promise<string> {
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
  }
}
