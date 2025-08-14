import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({
  timestamps: true,
  collection: 'books',
})
export class Book {
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ required: true, trim: true, maxlength: 100 })
  author: string;

  @Prop({ required: true, trim: true, maxlength: 50 })
  genre: string;

  @Prop({ required: true, min: 1800, max: new Date().getFullYear() })
  publishedYear: number;

  @Prop({ required: true, unique: true, trim: true, maxlength: 20 })
  isbn: string;

  @Prop({ required: true, min: 0, default: 0 })
  stockCount: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);

// Create indexes for better search performance
BookSchema.index({ title: 'text', author: 'text', genre: 'text' });
BookSchema.index({ isbn: 1 }, { unique: true });
BookSchema.index({ publishedYear: 1 });
BookSchema.index({ genre: 1 });
