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
import { FilesService } from 'src/files/files.service';
import { RatingRepository } from './space-rating.repository';
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
    // Explicitly join the picture relation
    query.leftJoinAndSelect('coworkingspace.pictures', 'picture');
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

  async addPictures(
    id: string,
    files: Express.Multer.File[], // accept multiple files
    user: User,
  ) {
    const coworkingspace = await this.getcoWorkingSpaceById(id);

    if (!coworkingspace) {
      throw new NotFoundException(
        `Could not find coworking space with id: ${id}`,
      );
    }

    if (coworkingspace.user.id !== user.id) {
      throw new ForbiddenException(
        `Hi, ${user.full_name}, you are not authorized to update this coworking space`,
      );
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
    coworkingspace.pictures = [...coworkingspace.pictures, ...uploadedFiles];
    await this.coworkingspaceRepository.save(coworkingspace);

    return uploadedFiles;
  }

  async deletePicture(coworkingSpaceId: string, fileId: string, user: User) {
    const coworkingspace = await this.getcoWorkingSpaceById(coworkingSpaceId);

    if (!coworkingspace) {
      throw new NotFoundException(
        `Could not find coworking space with id: ${coworkingSpaceId}`,
      );
    }

    if (coworkingspace.user.id !== user.id) {
      throw new ForbiddenException(
        `You are not authorized to delete this picture`,
      );
    }

    const picture = coworkingspace.pictures.find((pic) => pic.id === fileId);
    if (!picture) {
      throw new NotFoundException(`Picture not found`);
    }

    // Remove the picture from the array and update the coworking space
    coworkingspace.pictures = coworkingspace.pictures.filter(
      (pic) => pic.id !== fileId,
    );
    await this.coworkingspaceRepository.save(coworkingspace);

    // Delete the picture from storage
    await this.fileService.deletePublicFile(picture.id);

    return { message: 'Picture deleted successfully' };
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
