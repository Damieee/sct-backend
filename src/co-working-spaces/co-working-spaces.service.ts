import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCoWorkingSpaceDto } from './dto/create-co-working-space.dto';
import { UpdateCoWorkingSpaceDto } from './dto/update-co-working-space.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CoWorkingSpaceRepository } from './co-working-spaces.repository';
import { User } from 'src/auth/user.entity';
import { CoWorkingSpace } from './entities/co-working-space.entity';
import { filterDto } from './dto/get-co-working-space.dto';
import { v4 as uuid } from 'uuid';
import { FilesService } from 'src/files/files.service';
import { RatingRepository } from './rating.repository';
import { RateCoworkingSpaceDto } from './dto/rating.dto';

@Injectable()
export class CoWorkingSpacesService {
  constructor(
    @InjectRepository(CoWorkingSpaceRepository)
    @InjectRepository(RatingRepository)
    private coworkingspaceRepository: CoWorkingSpaceRepository,
    private ratingRepository: RatingRepository,
    private fileService: FilesService,
  ) {}
  async createCoworkingspace(
    createCoWorkingSpaceDto: CreateCoWorkingSpaceDto,
    user: User,
  ): Promise<CoWorkingSpace> {
    const {
      name,
      location,
      daily_rate,
      facilities,
      website,
      email,
      opening_hour,
      phone_number,
    } = createCoWorkingSpaceDto;
    const coworkingspace = this.coworkingspaceRepository.create({
      id: uuid(),
      name: name,
      location: location,
      daily_rate: daily_rate,
      facilities: facilities,
      averageRating: 0,
      totalRatings: 0,
      ratingsCount: 0,
      website: website,
      email: email,
      phone_number: phone_number,
      opening_hour: opening_hour,
      user,
    });
    await this.coworkingspaceRepository.save(coworkingspace);
    return coworkingspace;
  }

  async getCoworkingspaces(
    coworkingspacefilter: filterDto,
  ): Promise<CoWorkingSpace[]> {
    const { search } = coworkingspacefilter;
    const query =
      this.coworkingspaceRepository.createQueryBuilder('coworkingspace');

    if (search) {
      query.where(
        '(LOWER(coworkingspace.name) LIKE LOWER(:search) OR LOWER(coworkingspace.location) LIKE LOWER(:search) OR LOWER(coworkingspace.website) LIKE LOWER(:search) OR LOWER(coworkingspace.email) LIKE LOWER(:search) OR LOWER(coworkingspace.phone_number) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const coworkingspace = await query.getMany();
    return coworkingspace;
  }

  async getcoWorkingSpaceById(id: string): Promise<CoWorkingSpace> {
    const coworkingspace = await this.coworkingspaceRepository.findOne({
      where: { id },
    });

    if (!coworkingspace) {
      throw new NotFoundException(
        `could not find coworkingspace with id: ${id}`,
      );
    }
    return coworkingspace;
  }

  async updateCoworkingSpace(
    id: string,
    user,
    updateCoworkingSpaceDto: UpdateCoWorkingSpaceDto,
  ): Promise<CoWorkingSpace> {
    // Retrieve the coworking space by ID
    const coworkingspace = await this.getcoWorkingSpaceById(id);
    if (coworkingspace.user.id != user.id) {
      throw new ForbiddenException(
        `Hi, ${user.full_name}, you are not authorized to update this coworking space`,
      );
    }
    if (!coworkingspace) {
      throw new NotFoundException(
        `could not find coworkingspace with id: ${id}`,
      );
    }
    // Update the coworking space properties if provided
    if (updateCoworkingSpaceDto.name) {
      coworkingspace.name = updateCoworkingSpaceDto.name;
    }
    if (updateCoworkingSpaceDto.location) {
      coworkingspace.location = updateCoworkingSpaceDto.location;
    }
    if (updateCoworkingSpaceDto.daily_rate) {
      coworkingspace.daily_rate = updateCoworkingSpaceDto.daily_rate;
    }
    if (updateCoworkingSpaceDto.facilities) {
      coworkingspace.facilities = updateCoworkingSpaceDto.facilities;
    }
    if (updateCoworkingSpaceDto.opening_hour) {
      coworkingspace.opening_hour = updateCoworkingSpaceDto.opening_hour;
    }
    if (updateCoworkingSpaceDto.email) {
      coworkingspace.email = updateCoworkingSpaceDto.email;
    }
    if (updateCoworkingSpaceDto.website) {
      coworkingspace.website = updateCoworkingSpaceDto.website;
    }
    if (updateCoworkingSpaceDto.phone_number) {
      coworkingspace.phone_number = updateCoworkingSpaceDto.phone_number;
    }

    // Save the updated coworking space
    await this.coworkingspaceRepository.save(coworkingspace);

    // Return the updated coworking space
    return coworkingspace;
  }

  async deleteCoworkingSpace(id: string, user: User): Promise<string> {
    const coworkingspace = await this.getcoWorkingSpaceById(id);
    if (coworkingspace.user.id !== user.id) {
      throw new ForbiddenException(
        `Hi, ${user.full_name}, You are not authorized to delete this co-working space.`,
      );
    }
    if (!coworkingspace) {
      throw new NotFoundException(`Coworkingspace not found.`);
    }

    await this.coworkingspaceRepository.delete({ id });
    return `Coworkingspace with id ${id} deleted successfully`;
  }
  async addPicture(
    id: string,
    imageBuffer: Buffer,
    filename: string,
    user: User,
  ) {
    const coworkingspace = await this.getcoWorkingSpaceById(id);
    if (!coworkingspace) {
      throw new NotFoundException(
        `Could not find coworkingspace with id: ${id}`,
      );
    }
    if (coworkingspace.user.id != user.id) {
      throw new ForbiddenException(
        `Hi, ${user.full_name}, you are not authorized to update this coworking space`,
      );
    }
    if (coworkingspace.picture) {
      await this.coworkingspaceRepository.update(id, {
        ...coworkingspace,
        picture: null,
      });
      await this.fileService.deletePublicFile(coworkingspace.picture.id);
    }
    const picture = await this.fileService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    await this.coworkingspaceRepository.update(id, {
      ...coworkingspace,
      picture,
    });
    return picture;
  }

  async rateCoworkingSpace(
    coworkingSpaceId: string,
    rateCoworkingSpaceDto: RateCoworkingSpaceDto,
    user: User,
  ) {
    try {
      const { rating } = rateCoworkingSpaceDto;
      const userId = user.id;

      if (rating < 1 || rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5.');
      }

      // Check if user has already rated the coworking space
      const existingRating = await this.ratingRepository.findOne({
        where: [{ coworkingSpace: { id: coworkingSpaceId }, userId }],
      });

      if (existingRating) {
        throw new Error('You have already rated this coworking space.');
      }

      // Add new rating
      const coworkingSpace = await this.coworkingspaceRepository.findOne({
        where: { id: coworkingSpaceId },
      });
      if (!coworkingSpace) {
        throw new Error('Coworking space not found.');
      }

      const newRating = this.ratingRepository.create({
        coworkingSpace,
        rating,
        userId,
      });

      await this.ratingRepository.save(newRating);

      // Update coworking space average rating
      coworkingSpace.totalRatings += rating;
      coworkingSpace.ratingsCount += 1;
      coworkingSpace.averageRating =
        coworkingSpace.totalRatings / coworkingSpace.ratingsCount;

      await this.coworkingspaceRepository.save(coworkingSpace);

      return coworkingSpace;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
