import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors();

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // Swagger documentation setup
    const config = new DocumentBuilder()
      .setTitle('Library Management API')
      .setDescription('A comprehensive library management system API with fuzzy search capabilities')
      .setVersion('1.0')
      .addTag('books')
      .addTag('search')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  }
  return app;
}

export default async function handler(req: any, res: any) {
  try {
    console.log('Request received:', req.method, req.url);
    
    // Simple health check for debugging
    if (req.url === '/health' || req.url === '/api/health') {
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'API is running'
      });
    }
    
    const nestApp = await bootstrap();
    const expressInstance = nestApp.getHttpAdapter().getInstance();
    
    return new Promise((resolve, reject) => {
      expressInstance(req, res, (err: any) => {
        if (err) {
          console.error('Express error:', err);
          reject(err);
        } else {
          console.log('Request handled successfully');
          resolve(undefined);
        }
      });
    });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
