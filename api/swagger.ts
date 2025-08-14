import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

let swaggerDocument: any = null;
let isGenerating = false;

async function generateSwaggerDoc() {
  if (swaggerDocument) {
    return swaggerDocument;
  }

  if (isGenerating) {
    // Wait for the current generation to complete
    while (isGenerating) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return swaggerDocument;
  }

  isGenerating = true;
  try {
    console.log('Generating Swagger documentation...');
    
    // Create a minimal NestJS app just for Swagger
    const app = await NestFactory.create(AppModule, {
      logger: ['error'], // Reduce logging
    });

    const config = new DocumentBuilder()
      .setTitle('Library Management API')
      .setDescription('A comprehensive library management system API with fuzzy search capabilities')
      .setVersion('1.0')
      .addTag('books')
      .addTag('search')
      .addTag('health')
      .addTag('seed')
      .build();
    
    swaggerDocument = SwaggerModule.createDocument(app, config);
    
    await app.close(); // Clean up
    console.log('Swagger documentation generated successfully');
    return swaggerDocument;
  } catch (error) {
    console.error('Failed to generate Swagger documentation:', error);
    throw error;
  } finally {
    isGenerating = false;
  }
}

export default async function handler(req: any, res: any) {
  try {
    console.log('Swagger request received:', req.method, req.url);
    
    const document = await generateSwaggerDoc();
    
    // Serve Swagger UI
    const swaggerUi = require('swagger-ui-express');
    const swaggerUiHandler = swaggerUi.serve;
    const swaggerUiSetup = swaggerUi.setup(document, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Library Management API Documentation'
    });

    // Handle Swagger UI requests
    if (req.url === '/api' || req.url === '/api/') {
      // Serve the main Swagger UI page
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Library Management API Documentation" />
          <title>Library Management API Documentation</title>
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
          <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function() {
              const ui = SwaggerUIBundle({
                url: '/api/swagger.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
                plugins: [
                  SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
              });
            };
          </script>
        </body>
        </html>
      `);
      return;
    }

    if (req.url === '/api/swagger.json') {
      // Serve the Swagger JSON
      res.setHeader('Content-Type', 'application/json');
      res.json(document);
      return;
    }

    // Handle other Swagger UI assets
    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Swagger handler error:', error);
    res.status(500).json({
      error: 'Failed to load Swagger documentation',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
