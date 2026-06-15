const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Express API',
      version: '1.0.0',
      description: 'A complete REST API with authentication and products',
      contact: {
        name: 'Your Name',
        email: 'your@email.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // User schemas
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
              minLength: 2
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: '123456'
            }
          }
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              example: '123456'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login successful!' },
            token: { type: 'string', example: 'eyJhbGci...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '64f1a2b3...' },
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' }
              }
            }
          }
        },
        // Product schemas
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3...' },
            name: { type: 'string', example: 'Laptop' },
            description: { type: 'string', example: 'A powerful laptop' },
            price: { type: 'number', example: 999 },
            category: { type: 'string', example: 'Electronics' },
            stock: { type: 'number', example: 50 },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
          }
        },
        CreateProductInput: {
          type: 'object',
          required: ['name', 'description', 'price', 'category'],
          properties: {
            name: { type: 'string', example: 'Laptop' },
            description: { type: 'string', example: 'A powerful laptop' },
            price: { type: 'number', example: 999 },
            category: { type: 'string', example: 'Electronics' },
            stock: { type: 'number', example: 50 }
          }
        },
        // Error schemas
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Something went wrong' }
          }
        }
      }
    }
  },
  // where to look for API comments
  apis: ['./src/routes/*.js']
}

module.exports = swaggerJsdoc(options)