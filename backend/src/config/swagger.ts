import swaggerJsdoc from 'swagger-jsdoc';
import {
  createUserDocs,
  getAllUsersDocs,
  getUserByIdDocs,
  updateUserDocs,
  deleteUserDocs,
  exportUsersDocs,
  getPublicKeyDocs,
} from '../docs/user.docs';
import { healthCheckDocs } from '../docs/health.docs';
import { rootEndpointDocs } from '../docs/root.docs';


const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin Panel API',
      version: '1.0.0',
      description: 'RESTful API for Admin Panel with Protobuf serialization and RSA cryptographic signing',
      contact: {
        name: 'API Support',
        email: 'support@adminpanel.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Health',
        description: 'System health check',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'email', 'role', 'status', 'createdAt', 'emailHash', 'signature'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique user identifier',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'USER'],
              description: 'User role',
              example: 'USER',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE'],
              description: 'User status',
              example: 'ACTIVE',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2025-01-15T10:30:00Z',
            },
            emailHash: {
              type: 'string',
              description: 'SHA-384 hash of user email',
              example: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
            },
            signature: {
              type: 'string',
              description: 'RSA-4096 digital signature (base64)',
              example: 'MEUCIQDx...',
            },
          },
        },
        CreateUserDto: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'USER'],
              description: 'User role (defaults to USER)',
              example: 'USER',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE'],
              description: 'User status (defaults to ACTIVE)',
              example: 'ACTIVE',
            },
          },
        },
        UpdateUserDto: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Updated email address',
              example: 'jane.doe@example.com',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'USER'],
              description: 'Updated role',
              example: 'ADMIN',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE'],
              description: 'Updated status',
              example: 'INACTIVE',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'User not found',
            },
            details: {
              type: 'string',
              description: 'Additional error details',
            },
          },
        },
        PublicKey: {
          type: 'object',
          properties: {
            publicKey: {
              type: 'string',
              description: 'RSA public key in PEM format',
              example: '-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhki...\n-----END PUBLIC KEY-----',
            },
          },
        },
      },
    },
    paths: {
      '/': rootEndpointDocs,
      '/health': healthCheckDocs,
      '/api/users': {
        ...createUserDocs,
        ...getAllUsersDocs,
      },
      '/api/users/{id}': {
        ...getUserByIdDocs,
        ...updateUserDocs,
        ...deleteUserDocs,
      },
      '/api/users/export': exportUsersDocs,
      '/api/users/public-key': getPublicKeyDocs,
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
