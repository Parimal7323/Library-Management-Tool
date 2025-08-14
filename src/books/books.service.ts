import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  /**
   * Create a new book
   */
  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const createdBook = new this.bookModel(createBookDto);
      return await createdBook.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('A book with this ISBN already exists');
      }
      throw error;
    }
  }

  /**
   * Get all books with pagination and filtering
   */
  async findAll(queryDto: QueryBookDto) {
    const { page = 1, limit = 10, genre, author, publishedYear } = queryDto;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (genre) filter.genre = { $regex: genre, $options: 'i' };
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (publishedYear) filter.publishedYear = publishedYear;

    // Execute query with pagination
    const [books, total] = await Promise.all([
      this.bookModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookModel.countDocuments(filter).exec(),
    ]);

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a book by ID
   */
  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  /**
   * Update a book by ID
   */
  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    try {
      const updatedBook = await this.bookModel
        .findByIdAndUpdate(id, updateBookDto, { new: true, runValidators: true })
        .exec();
      
      if (!updatedBook) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      
      return updatedBook;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('A book with this ISBN already exists');
      }
      throw error;
    }
  }

  /**
   * Delete a book by ID
   */
  async remove(id: string): Promise<{ message: string }> {
    const deletedBook = await this.bookModel.findByIdAndDelete(id).exec();
    
    if (!deletedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    
    return { message: 'Book deleted successfully' };
  }

  /**
   * Get all books for search functionality
   */
  async getAllBooksForSearch(): Promise<Book[]> {
    return this.bookModel.find().select('title author genre').exec();
  }
}
