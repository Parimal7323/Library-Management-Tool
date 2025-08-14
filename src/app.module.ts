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
      envFilePath: ['.env.local', '.env'],
    }),
    
    // MongoDB connection with graceful fallback for serverless
    MongooseModule.forRootAsync({
      useFactory: () => {
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
          console.warn('⚠️  MONGODB_URI not found in environment variables');
          console.warn('📝 Please set MONGODB_URI in Vercel environment variables');
          console.warn('🔗 Using fallback configuration for demo purposes');
          
          // Return a dummy configuration that won't actually connect
          return {
            uri: 'mongodb://localhost:27017/library-management',
            bufferCommands: false,
            maxPoolSize: 1,
            serverSelectionTimeoutMS: 1000, // Quick timeout for demo
            socketTimeoutMS: 5000,
            family: 4,
            // This will fail quickly but gracefully
            retryWrites: false,
            w: 0,
          };
        }
        
        console.log('✅ MongoDB URI found, connecting to database...');
        return {
          uri: mongoUri,
          bufferCommands: false,
          maxPoolSize: 1, // Important for serverless
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          family: 4, // Use IPv4
        };
      },
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
