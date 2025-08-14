import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@ApiTags('search')
@Controller('search')
@UseGuards(ThrottlerGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Search books by title, author, or genre using fuzzy search',
    description: 'Implements case-insensitive fuzzy search algorithm. Example: searching for "Pottr" will match "Harry Potter"'
  })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results (1-50)' })
  @ApiQuery({ name: 'threshold', required: false, type: Number, description: 'Similarity threshold (0-1)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Search results retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              book: { $ref: '#/components/schemas/Book' },
              score: { type: 'number' },
              matches: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    key: { type: 'string' },
                    value: { type: 'string' },
                    indices: { type: 'array', items: { type: 'array' } }
                  }
                }
              }
            }
          }
        },
        total: { type: 'number' },
        threshold: { type: 'number' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation error' 
  })
  search(@Query() searchQueryDto: SearchQueryDto) {
    return this.searchService.search(searchQueryDto);
  }

  @Get('suggestions')
  @ApiOperation({ 
    summary: 'Get search suggestions based on partial input',
    description: 'Returns book suggestions for autocomplete functionality'
  })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Partial search query' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of suggestions (default: 5)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Suggestions retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          author: { type: 'string' },
          genre: { type: 'string' },
          score: { type: 'number' }
        }
      }
    }
  })
  getSuggestions(
    @Query('q') query: string,
    @Query('limit') limit: number = 5,
  ) {
    return this.searchService.getSuggestions(query, limit);
  }
}
