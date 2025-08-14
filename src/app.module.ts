import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { SearchModule } from './search/search.module';
import { SeedModule } from './seed/seed.module';
import { HealthModule } from './health/health.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // MongoDB connection with better error handling for serverless
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/library-management', {
      bufferCommands: false,
      maxPoolSize: 1, // Important for serverless
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),
    
    // Feature modules
    BooksModule,
    SearchModule,
    SeedModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [LoggingMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*');
  }
}
