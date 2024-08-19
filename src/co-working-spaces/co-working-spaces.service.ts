import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoWorkingSpaceDto } from './dto/create-co-working-space.dto';
import { UpdateCoWorkingSpaceDto } from './dto/update-co-working-space.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CoWorkingSpaceRepository } from './co-working-spaces.repository';
import { User } from 'src/auth/user.entity';
import { CoWorkingSpace } from './entities/co-working-space.entity';
import { filterDto } from './dto/get-co-working-space.dto';
import { v4 as uuid } from 'uuid';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class CoWorkingSpacesService {
  constructor(
    @InjectRepository(CoWorkingSpaceRepository)
    private coworkingspaceRepository: CoWorkingSpaceRepository,
    private fileService: FilesService,
  ) {}
  async createCoworkingspace(
    createCoWorkingSpaceDto: CreateCoWorkingSpaceDto,
    user: User,
  ): Promise<CoWorkingSpace> {
    const { name, location, pricing_range, facilities, rating, contact_info } =
      createCoWorkingSpaceDto;
    const coworkingspace = this.coworkingspaceRepository.create({
      id: uuid(),
      name: name,
      location: location,
      pricing_range: pricing_range,
      facilities: facilities,
      rating: rating,
      contact_info: contact_info,
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
      query.andWhere(
        '(LOWER(coworkingspace.name) LIKE LOWER(:search) OR LOWER(coworkingspace.location) LIKE LOWER(:search) OR LOWER(coworkingspace.facilities) LIKE LOWER(:search) OR LOWER(coworkingspace.contact_info) LIKE LOWER(:search))',
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
    updateCoworkingSpaceDto: UpdateCoWorkingSpaceDto,
    user: User,
  ): Promise<CoWorkingSpace> {
    // Retrieve the coworking space by ID
    const coworkingspace = await this.coworkingspaceRepository.findOne({
      where: { id, user },
    });

    // Update the coworking space properties if provided
    if (updateCoworkingSpaceDto.name) {
      coworkingspace.name = updateCoworkingSpaceDto.name;
    }
    if (updateCoworkingSpaceDto.location) {
      coworkingspace.location = updateCoworkingSpaceDto.location;
    }
    if (updateCoworkingSpaceDto.pricing_range) {
      coworkingspace.pricing_range = updateCoworkingSpaceDto.pricing_range;
    }
    if (updateCoworkingSpaceDto.facilities) {
      coworkingspace.facilities = updateCoworkingSpaceDto.facilities;
    }
    if (updateCoworkingSpaceDto.contact_info) {
      coworkingspace.contact_info = updateCoworkingSpaceDto.contact_info;
    }

    // Save the updated coworking space
    await this.coworkingspaceRepository.save(coworkingspace);

    // Return the updated coworking space
    return coworkingspace;
  }

  async deleteCoworkingSpace(id: string, user: User): Promise<string> {
    const found = await this.coworkingspaceRepository.delete({ id, user });
    if (found.affected === 0) {
      throw new NotFoundException(
        `could not find coworkingspace with id: ${id}`,
      );
    }
    return `Coworkingspace with id ${id} deleted successfully`;
  }
  async addPicture(id: string, imageBuffer: Buffer, filename: string) {
    const coworkingspace = await this.getcoWorkingSpaceById(id);
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
}
