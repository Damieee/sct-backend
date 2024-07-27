import { Injectable } from '@nestjs/common';
import { CreateCoWorkingSpaceDto } from './dto/create-co-working-space.dto';
import { UpdateCoWorkingSpaceDto } from './dto/update-co-working-space.dto';

@Injectable()
export class CoWorkingSpacesService {
  create(createCoWorkingSpaceDto: CreateCoWorkingSpaceDto) {
    return 'This action adds a new coWorkingSpace';
  }

  findAll() {
    return `This action returns all coWorkingSpaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coWorkingSpace`;
  }

  update(id: number, updateCoWorkingSpaceDto: UpdateCoWorkingSpaceDto) {
    return `This action updates a #${id} coWorkingSpace`;
  }

  remove(id: number) {
    return `This action removes a #${id} coWorkingSpace`;
  }
}
