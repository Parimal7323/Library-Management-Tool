import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, Max, Length, Matches } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'The title of the book',
    example: 'Harry Potter and the Philosopher\'s Stone',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'J.K. Rowling',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  author: string;

  @ApiProperty({
    description: 'The genre of the book',
    example: 'Fantasy',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  genre: string;

  @ApiProperty({
    description: 'The year the book was published',
    example: 1997,
    minimum: 1800,
    maximum: 2024,
  })
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear())
  publishedYear: number;

  @ApiProperty({
    description: 'The ISBN of the book (unique identifier)',
    example: '978-0-7475-3269-9',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @Matches(/^[0-9-]+$/, { message: 'ISBN must contain only numbers and hyphens' })
  isbn: string;

  @ApiProperty({
    description: 'The number of copies available in stock',
    example: 5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  stockCount: number;
}
