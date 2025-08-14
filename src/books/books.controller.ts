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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { Book } from './schemas/book.schema';

@ApiTags('books')
@Controller('books')
@UseGuards(ThrottlerGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new book to the library' })
  @ApiResponse({ 
    status: 201, 
    description: 'Book created successfully',
    type: Book 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation error' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - ISBN already exists' 
  })
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of all books' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'genre', required: false, type: String, description: 'Filter by genre' })
  @ApiQuery({ name: 'author', required: false, type: String, description: 'Filter by author' })
  @ApiQuery({ name: 'publishedYear', required: false, type: Number, description: 'Filter by published year' })
  @ApiResponse({ 
    status: 200, 
    description: 'Books retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        books: {
          type: 'array',
          items: { $ref: '#/components/schemas/Book' }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' }
          }
        }
      }
    }
  })
  findAll(@Query() queryDto: QueryBookDto) {
    return this.booksService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve details of a specific book by its ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Book retrieved successfully',
    type: Book 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Book not found' 
  })
  findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update details of a specific book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Book updated successfully',
    type: Book 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Book not found' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - ISBN already exists' 
  })
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a book from the library' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Book deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Book not found' 
  })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.booksService.remove(id);
  }
}
