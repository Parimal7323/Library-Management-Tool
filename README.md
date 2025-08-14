# Library Management API

A comprehensive library management system API built with NestJS, MongoDB, and featuring advanced fuzzy search capabilities.

## 🌐 Live Demo

**🚀 Production API**: [https://library-management-tool.vercel.app](https://library-management-tool.vercel.app)

**📚 Interactive Documentation**: [https://library-management-tool.vercel.app/api](https://library-management-tool.vercel.app/api)

## 🚀 Features

- **CRUD Operations**: Full Create, Read, Update, Delete operations for books
- **Fuzzy Search**: Advanced search algorithm using Fuse.js for partial matches
- **Pagination**: Efficient pagination for large datasets
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Request Logging**: Comprehensive request/response logging
- **Swagger Documentation**: Interactive API documentation
- **MongoDB Integration**: Robust database with proper indexing
- **Validation**: Comprehensive input validation and error handling
- **Serverless Deployment**: Optimized for Vercel serverless functions

## 📋 Requirements

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/library-management
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally, or
   - Use MongoDB Atlas (cloud) and update the `MONGODB_URI` in your `.env` file

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Testing
```bash
npm run test
npm run test:e2e
```

## 📚 API Endpoints

### Base URL
- **Production**: `https://library-management-tool.vercel.app`
- **Local Development**: `http://localhost:3000`

### Books Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/books` | Add a new book |
| `GET` | `/books` | Get paginated list of books |
| `GET` | `/books/:id` | Get book by ID |
| `PATCH` | `/books/:id` | Update book details |
| `DELETE` | `/books/:id` | Delete a book |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/search` | Fuzzy search books |
| `GET` | `/search/suggestions` | Get search suggestions |

### Health & Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Welcome message and API info |
| `GET` | `/health` | Health check |
| `GET` | `/api` | Interactive Swagger documentation |

### Query Parameters

#### Books List (`GET /books`)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `genre` (string): Filter by genre
- `author` (string): Filter by author
- `publishedYear` (number): Filter by published year

#### Search (`GET /search`)
- `q` (string, required): Search query
- `limit` (number): Number of results (default: 10, max: 50)
- `threshold` (number): Similarity threshold 0-1 (default: 0.3)

## 📖 API Documentation

### Production
- **Swagger UI**: [https://library-management-tool.vercel.app/api](https://library-management-tool.vercel.app/api)
- **Health Check**: [https://library-management-tool.vercel.app/health](https://library-management-tool.vercel.app/health)
- **Root Endpoint**: [https://library-management-tool.vercel.app/](https://library-management-tool.vercel.app/)

### Local Development
- **Swagger UI**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`

## 🔍 Fuzzy Search Examples

The fuzzy search algorithm can handle:
- **Partial matches**: "Pottr" → "Harry Potter"
- **Case insensitive**: "harry" → "Harry Potter"
- **Typos**: "Hary" → "Harry Potter"
- **Genre search**: "fantasy" → "Fantasy books"

### Example Search Queries
```bash
# Search for Harry Potter books
GET https://library-management-tool.vercel.app/search?q=harry potter

# Search with custom threshold
GET https://library-management-tool.vercel.app/search?q=pottr&threshold=0.4

# Get search suggestions
GET https://library-management-tool.vercel.app/search/suggestions?q=har
```

## 🗄️ Database Schema

### Book Collection
```javascript
{
  title: String (required, max: 200),
  author: String (required, max: 100),
  genre: String (required, max: 50),
  publishedYear: Number (required, min: 1800),
  isbn: String (required, unique, max: 20),
  stockCount: Number (required, min: 0),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Indexes
- Text index on `title`, `author`, `genre`
- Unique index on `isbn`
- Index on `publishedYear`
- Index on `genre`

## 🚀 Deployment to Vercel

### Prerequisites
- Vercel account
- MongoDB Atlas (or other cloud MongoDB provider)

### Deployment Steps

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   In your Vercel dashboard:
   - Go to your project settings
   - Add environment variable: `MONGODB_URI`
   - Set the value to your MongoDB connection string

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-management
NODE_ENV=production
```

### Vercel Configuration
The project includes optimized configuration for Vercel serverless deployment:
- **Function timeout**: 60 seconds
- **Serverless optimization**: Reduced MongoDB connection pool
- **Static Swagger documentation**: Fast-loading API docs
- **Graceful error handling**: Proper fallbacks for missing environment variables

## 🧪 Testing the API

### Sample Book Creation
```bash
curl -X POST https://library-management-tool.vercel.app/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Harry Potter and the Philosopher\'s Stone",
    "author": "J.K. Rowling",
    "genre": "Fantasy",
    "publishedYear": 1997,
    "isbn": "978-0-7475-3269-9",
    "stockCount": 5
  }'
```

### Sample Search
```bash
curl "https://library-management-tool.vercel.app/search?q=harry&limit=5"
```

### Health Check
```bash
curl "https://library-management-tool.vercel.app/health"
```

## 🔧 Configuration

### Rate Limiting
- Default: 100 requests per minute
- Configurable in `app.module.ts`

### Search Configuration
- Default threshold: 0.3
- Searchable fields: title (50% weight), author (30% weight), genre (20% weight)

### Serverless Optimization
- **Cold start handling**: Graceful initialization with fallbacks
- **Connection pooling**: Optimized for serverless environment
- **Timeout management**: 60-second function timeout
- **Error handling**: Comprehensive error responses

## 📝 Logging

The application logs:
- HTTP method and URL
- Timestamp
- IP address
- User agent
- Response time
- Status codes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the Swagger documentation at [https://library-management-tool.vercel.app/api](https://library-management-tool.vercel.app/api)
- Review the logs for debugging information

## 🎯 Project Structure

```
src/
├── books/                 # Books module
│   ├── dto/              # Data Transfer Objects
│   ├── schemas/          # MongoDB schemas
│   ├── books.controller.ts
│   ├── books.service.ts
│   └── books.module.ts
├── search/               # Search module
│   ├── dto/              # Search DTOs
│   ├── search.controller.ts
│   ├── search.service.ts
│   └── search.module.ts
├── middleware/           # Custom middleware
│   └── logging.middleware.ts
├── app.module.ts         # Main application module
└── main.ts              # Application entry point
api/
├── index.ts             # Main API handler for Vercel
└── swagger.ts           # Static Swagger documentation
```

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS enabled
- Proper error handling
- No sensitive data exposure in logs
- Serverless security best practices

## 🌟 Production Features

- **High Availability**: Deployed on Vercel's global CDN
- **Auto-scaling**: Serverless functions scale automatically
- **Fast Response**: Optimized for quick API responses
- **Professional Documentation**: Interactive Swagger UI
- **Health Monitoring**: Built-in health check endpoints
