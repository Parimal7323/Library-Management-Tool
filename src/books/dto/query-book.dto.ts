import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryBookDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by genre',
    example: 'Fantasy',
  })
  @IsOptional()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Filter by author',
    example: 'J.K. Rowling',
  })
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({
    description: 'Filter by published year',
    example: 1997,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  publishedYear?: number;
}
