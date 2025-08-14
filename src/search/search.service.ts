import { Injectable } from '@nestjs/common';
import Fuse from 'fuse.js';
import { BooksService } from '../books/books.service';
import { Book } from '../books/schemas/book.schema';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  private fuse: Fuse<Book>;

  constructor(private readonly booksService: BooksService) {}

  /**
   * Initialize Fuse.js with books data
   */
  private async initializeFuse(): Promise<void> {
    const books = await this.booksService.getAllBooksForSearch();
    
    // Configure Fuse.js options for fuzzy search
    const options = {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'author', weight: 0.3 },
        { name: 'genre', weight: 0.2 },
      ],
      threshold: 0.3, // Default threshold
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      findAllMatches: true,
      location: 0,
      distance: 100,
      useExtendedSearch: false,
      ignoreLocation: false,
      ignoreFieldNorm: false,
    };

    this.fuse = new Fuse(books, options);
  }

  /**
   * Perform fuzzy search on books
   */
  async search(searchQueryDto: SearchQueryDto) {
    const { q, limit = 10, threshold = 0.3 } = searchQueryDto;

    // Initialize Fuse.js if not already done
    if (!this.fuse) {
      await this.initializeFuse();
    }

    // Update threshold if provided
    this.fuse.setCollection(await this.booksService.getAllBooksForSearch());

    // Perform search
    const results = this.fuse.search(q, {
      limit,
    });

    // Format results
    const formattedResults = results.map(result => ({
      book: result.item,
      score: result.score,
      matches: result.matches?.map(match => ({
        key: match.key,
        value: match.value,
        indices: match.indices,
      })),
    }));

    return {
      query: q,
      results: formattedResults,
      total: formattedResults.length,
      threshold,
    };
  }

  /**
   * Get search suggestions based on partial input
   */
  async getSuggestions(query: string, limit: number = 5) {
    if (!this.fuse) {
      await this.initializeFuse();
    }

    const results = this.fuse.search(query, {
      limit,
    });

    return results.map(result => ({
      title: result.item.title,
      author: result.item.author,
      genre: result.item.genre,
      score: result.score,
    }));
  }
}
