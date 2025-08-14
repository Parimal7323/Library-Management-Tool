import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '../books/schemas/book.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async seedBooks() {
    const sampleBooks = [
      {
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        publishedYear: 1997,
        isbn: '978-0-7475-3269-9',
        stockCount: 5,
      },
      {
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        publishedYear: 1954,
        isbn: '978-0-618-00222-1',
        stockCount: 3,
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        publishedYear: 1960,
        isbn: '978-0-06-112008-4',
        stockCount: 7,
      },
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        publishedYear: 1949,
        isbn: '978-0-452-28423-4',
        stockCount: 4,
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        publishedYear: 1813,
        isbn: '978-0-14-143951-8',
        stockCount: 6,
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        publishedYear: 1925,
        isbn: '978-0-7432-7356-5',
        stockCount: 8,
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        publishedYear: 1937,
        isbn: '978-0-618-00221-4',
        stockCount: 10,
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Fiction',
        publishedYear: 1951,
        isbn: '978-0-316-76948-0',
        stockCount: 2,
      },
      {
        title: 'Animal Farm',
        author: 'George Orwell',
        genre: 'Dystopian',
        publishedYear: 1945,
        isbn: '978-0-452-28424-1',
        stockCount: 9,
      },
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        genre: 'Fiction',
        publishedYear: 1988,
        isbn: '978-0-06-231500-7',
        stockCount: 12,
      },
    ];

    try {
      // Clear existing books
      await this.bookModel.deleteMany({});
      
      // Insert sample books
      const insertedBooks = await this.bookModel.insertMany(sampleBooks);
      
      console.log(`✅ Successfully seeded ${insertedBooks.length} books`);
      return insertedBooks;
    } catch (error) {
      console.error('❌ Error seeding books:', error);
      throw error;
    }
  }

  async clearBooks() {
    try {
      await this.bookModel.deleteMany({});
      console.log('✅ Successfully cleared all books');
    } catch (error) {
      console.error('❌ Error clearing books:', error);
      throw error;
    }
  }
}
