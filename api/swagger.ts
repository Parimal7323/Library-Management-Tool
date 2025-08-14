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
    
    // Static Swagger documentation
    const swaggerDocument = {
      openapi: "3.0.0",
      info: {
        title: "Library Management API",
        description: "A comprehensive library management system API with fuzzy search capabilities",
        version: "1.0.0",
        contact: {
          name: "Library Management Team"
        }
      },
      servers: [
        {
          url: "https://library-management-tool.vercel.app",
          description: "Production server"
        }
      ],
      tags: [
        {
          name: "books",
          description: "Book management operations"
        },
        {
          name: "search",
          description: "Fuzzy search operations"
        },
        {
          name: "health",
          description: "Health check operations"
        },
        {
          name: "seed",
          description: "Database seeding operations"
        }
      ],
      paths: {
        "/": {
          get: {
            tags: ["health"],
            summary: "Welcome message",
            description: "Get API welcome message and available endpoints",
            responses: {
              "200": {
                description: "Welcome message",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        version: { type: "string" },
                        endpoints: { type: "object" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/health": {
          get: {
            tags: ["health"],
            summary: "Health check",
            description: "Check API health status",
            responses: {
              "200": {
                description: "Health status",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        status: { type: "string" },
                        timestamp: { type: "string" },
                        message: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/books": {
          get: {
            tags: ["books"],
            summary: "Get all books",
            description: "Retrieve a list of all books with optional pagination and filtering",
            parameters: [
              {
                name: "page",
                in: "query",
                description: "Page number",
                schema: { type: "integer", default: 1 }
              },
              {
                name: "limit",
                in: "query",
                description: "Number of items per page",
                schema: { type: "integer", default: 10 }
              },
              {
                name: "title",
                in: "query",
                description: "Filter by book title",
                schema: { type: "string" }
              },
              {
                name: "author",
                in: "query",
                description: "Filter by author",
                schema: { type: "string" }
              },
              {
                name: "genre",
                in: "query",
                description: "Filter by genre",
                schema: { type: "string" }
              }
            ],
            responses: {
              "200": {
                description: "List of books",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        books: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              _id: { type: "string" },
                              title: { type: "string" },
                              author: { type: "string" },
                              genre: { type: "string" },
                              isbn: { type: "string" },
                              publishedYear: { type: "integer" },
                              description: { type: "string" },
                              createdAt: { type: "string" },
                              updatedAt: { type: "string" }
                            }
                          }
                        },
                        pagination: {
                          type: "object",
                          properties: {
                            page: { type: "integer" },
                            limit: { type: "integer" },
                            total: { type: "integer" },
                            pages: { type: "integer" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          post: {
            tags: ["books"],
            summary: "Create a new book",
            description: "Add a new book to the library",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["title", "author"],
                    properties: {
                      title: { type: "string" },
                      author: { type: "string" },
                      genre: { type: "string" },
                      isbn: { type: "string" },
                      publishedYear: { type: "integer" },
                      description: { type: "string" }
                    }
                  }
                }
              }
            },
            responses: {
              "201": {
                description: "Book created successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        book: {
                          type: "object",
                          properties: {
                            _id: { type: "string" },
                            title: { type: "string" },
                            author: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/books/{id}": {
          get: {
            tags: ["books"],
            summary: "Get book by ID",
            description: "Retrieve a specific book by its ID",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                description: "Book ID",
                schema: { type: "string" }
              }
            ],
            responses: {
              "200": {
                description: "Book details",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        _id: { type: "string" },
                        title: { type: "string" },
                        author: { type: "string" },
                        genre: { type: "string" },
                        isbn: { type: "string" },
                        publishedYear: { type: "integer" },
                        description: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          put: {
            tags: ["books"],
            summary: "Update book",
            description: "Update an existing book",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                description: "Book ID",
                schema: { type: "string" }
              }
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      author: { type: "string" },
                      genre: { type: "string" },
                      isbn: { type: "string" },
                      publishedYear: { type: "integer" },
                      description: { type: "string" }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Book updated successfully"
              }
            }
          },
          delete: {
            tags: ["books"],
            summary: "Delete book",
            description: "Delete a book from the library",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                description: "Book ID",
                schema: { type: "string" }
              }
            ],
            responses: {
              "200": {
                description: "Book deleted successfully"
              }
            }
          }
        },
        "/search": {
          get: {
            tags: ["search"],
            summary: "Search books",
            description: "Perform fuzzy search on books",
            parameters: [
              {
                name: "q",
                in: "query",
                required: true,
                description: "Search query",
                schema: { type: "string" }
              },
              {
                name: "limit",
                in: "query",
                description: "Maximum number of results",
                schema: { type: "integer", default: 10 }
              }
            ],
            responses: {
              "200": {
                description: "Search results",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        results: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              item: {
                                type: "object",
                                properties: {
                                  _id: { type: "string" },
                                  title: { type: "string" },
                                  author: { type: "string" }
                                }
                              },
                              score: { type: "number" }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/seed": {
          post: {
            tags: ["seed"],
            summary: "Seed database",
            description: "Populate database with sample books",
            responses: {
              "201": {
                description: "Database seeded successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string" },
                        count: { type: "integer" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          Book: {
            type: "object",
            properties: {
              _id: { type: "string" },
              title: { type: "string" },
              author: { type: "string" },
              genre: { type: "string" },
              isbn: { type: "string" },
              publishedYear: { type: "integer" },
              description: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" }
            }
          }
        }
      }
    };

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
                spec: ${JSON.stringify(swaggerDocument)},
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
      res.json(swaggerDocument);
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
