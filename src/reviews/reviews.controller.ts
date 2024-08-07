import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto'; // Assuming you have this DTO
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Review } from './entities/review.entity'; // Assuming you have this entity

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(AuthGuard())
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new review' })
  @ApiResponse({ status: 201, description: 'Review has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateReviewDto })
  createReview(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewService.createReview(createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Reviews have been successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  getAllReviews(): Promise<Review[]> {
    return this.reviewService.getAllReviews();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Review has been successfully retrieved.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  getReviewById(@Param('id') id: number): Promise<Review> {
    return this.reviewService.getReviewById(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update review by ID' })
  @ApiResponse({ status: 200, description: 'Review has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  @ApiBody({ type: UpdateReviewDto })
  updateReview(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewService.updateReview(id, updateReviewDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete review by ID' })
  @ApiResponse({ status: 200, description: 'Review has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  deleteReview(@Param('id') id: number): Promise<string> {
    return this.reviewService.deleteReview(id);
  }
}
