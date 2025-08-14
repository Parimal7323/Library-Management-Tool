import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'Welcome to Library Management API',
      version: '1.0.0',
      endpoints: {
        books: '/books',
        search: '/search',
        health: '/health',
        seed: '/seed',
        documentation: '/api'
      },
      description: 'A comprehensive library management system API with fuzzy search capabilities'
    };
  }
}
