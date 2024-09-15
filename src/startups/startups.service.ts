import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
import { Startup } from './entities/startup.entity';
import { User } from 'src/auth/user.entity';
import { StartupRepository } from './startups.repository';

@Injectable()
export class StartupsService {
  constructor(
    @InjectRepository(StartupRepository)
    private readonly startupRepository: StartupRepository,
  ) {}

  async createStartup(
    createStartupDto: CreateStartupDto,
    user: User,
  ): Promise<Startup> {
    const { name, description, tags, category, logo } = createStartupDto;
    const startup = this.startupRepository.create({
      name,
      description,
      tags,
      logo,
      category
      user,
    });
    await this.startupRepository.save(startup);
    return startup;
  }

  async getStartups(): Promise<Startup[]> {
    return this.startupRepository.find();
  }

  async getStartupById(id: string): Promise<Startup> {
    const startup = await this.startupRepository.findOne({ where: { id } });
    if (!startup) {
      throw new NotFoundException(`Could not find startup with ID ${id}`);
    }
    return startup;
  }

  async updateStartup(
    id: string,
    updateStartupDto: UpdateStartupDto,
    user: User,
  ): Promise<Startup> {
    const startup = await this.startupRepository.preload({
      id: id,
      ...updateStartupDto,
      user,
    });

    if (!startup) {
      throw new NotFoundException(`Could not find startup with ID ${id}`);
    }

    return this.startupRepository.save(startup);
  }

  async deleteStartup(id: string, user: User): Promise<string> {
    const result = await this.startupRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Could not find startup with ID ${id}`);
    }
    return `Startup with ID ${id} deleted successfully`;
  }
}
