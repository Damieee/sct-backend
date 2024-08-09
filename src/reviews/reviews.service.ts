import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto'; // Assuming you have this DTO
import { Review } from './entities/review.entity'; // Assuming you have this entity
import { User } from 'src/auth/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createReview(
    createReviewDto: CreateReviewDto,
    user: User,
  ): Promise<Review> {
    const { rating, comment } = createReviewDto;
    const review = this.reviewRepository.create({
      rating: rating,
      comment: comment,
      user,
    });
    await this.reviewRepository.save(review);
    return review;
  }

  async getAllReviews(): Promise<Review[]> {
    return this.reviewRepository.find();
  }

  async getReviewById(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async updateReview(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewRepository.preload({
      id,
      ...updateReviewDto,
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return this.reviewRepository.save(review);
  }

  async deleteReview(id: number): Promise<string> {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return `Review with ID ${id} has been successfully deleted`;
  }
}
