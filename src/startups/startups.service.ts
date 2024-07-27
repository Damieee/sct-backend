import { Injectable } from '@nestjs/common';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';

@Injectable()
export class StartupsService {
  create(createStartupDto: CreateStartupDto) {
    return 'This action adds a new startup';
  }

  findAll() {
    return `This action returns all startups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} startup`;
  }

  update(id: number, updateStartupDto: UpdateStartupDto) {
    return `This action updates a #${id} startup`;
  }

  remove(id: number) {
    return `This action removes a #${id} startup`;
  }
}
