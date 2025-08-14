import { Controller, Post, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SeedService } from './seed.service';

@ApiTags('seed')
@Controller('seed')
@UseGuards(ThrottlerGuard)
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Seed the database with sample books',
    description: 'Adds 10 sample books to the database for testing purposes'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Database seeded successfully' 
  })
  async seedBooks() {
    const books = await this.seedService.seedBooks();
    return {
      message: 'Database seeded successfully',
      count: books.length,
      books: books.map(book => ({
        title: book.title,
        author: book.author,
        genre: book.genre,
      })),
    };
  }

  @Delete()
  @ApiOperation({ 
    summary: 'Clear all books from the database',
    description: 'Removes all books from the database (use with caution)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'All books cleared successfully' 
  })
  async clearBooks() {
    await this.seedService.clearBooks();
    return {
      message: 'All books cleared successfully',
    };
  }
}
