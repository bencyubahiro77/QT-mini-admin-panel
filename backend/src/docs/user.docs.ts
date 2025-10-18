export const createUserDocs = {
  post: {
    summary: 'Create a new user',
    description: 'Creates a new user with automatic SHA-384 email hashing and RSA digital signature',
    tags: ['Users'],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateUserDto',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User created successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                publicKey: {
                  type: 'string',
                  description: 'RSA public key for signature verification',
                },
              },
            },
          },
        },
      },
      400: {
        description: 'Invalid input',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      409: {
        description: 'User already exists',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};

export const getAllUsersDocs = {
  get: {
    summary: 'Get all users with pagination, search, and filters',
    description: 'Retrieves a paginated list of users with support for search, sorting, and filtering',
    tags: ['Users'],
    parameters: [
      {
        in: 'query',
        name: 'page',
        schema: {
          type: 'integer',
          minimum: 1,
          default: 1,
        },
        description: 'Page number',
      },
      {
        in: 'query',
        name: 'limit',
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 10,
        },
        description: 'Number of items per page (max 100)',
      },
      {
        in: 'query',
        name: 'search',
        schema: {
          type: 'string',
        },
        description: 'Search by email (case-insensitive)',
      },
      {
        in: 'query',
        name: 'sortBy',
        schema: {
          type: 'string',
          enum: ['email', 'role', 'status', 'createdAt', 'updatedAt'],
          default: 'createdAt',
        },
        description: 'Field to sort by',
      },
      {
        in: 'query',
        name: 'sortOrder',
        schema: {
          type: 'string',
          enum: ['asc', 'desc'],
          default: 'desc',
        },
        description: 'Sort order',
      },
      {
        in: 'query',
        name: 'filterRole',
        schema: {
          type: 'string',
          enum: ['ADMIN', 'USER'],
        },
        description: 'Filter by role',
      },
      {
        in: 'query',
        name: 'filterStatus',
        schema: {
          type: 'string',
          enum: ['ACTIVE', 'INACTIVE'],
        },
        description: 'Filter by status',
      },
    ],
    responses: {
      200: {
        description: 'Paginated list of users',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                users: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User',
                  },
                },
                pagination: {
                  type: 'object',
                  properties: {
                    currentPage: {
                      type: 'integer',
                      example: 1,
                    },
                    totalPages: {
                      type: 'integer',
                      example: 5,
                    },
                    totalCount: {
                      type: 'integer',
                      example: 50,
                    },
                    pageSize: {
                      type: 'integer',
                      example: 10,
                    },
                    hasNextPage: {
                      type: 'boolean',
                      example: true,
                    },
                    hasPreviousPage: {
                      type: 'boolean',
                      example: false,
                    },
                  },
                },
              },
            },
          },
        },
      },
      500: {
        description: 'Server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};

export const getUserByIdDocs = {
  get: {
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their unique identifier',
    tags: ['Users'],
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid',
        },
        description: 'User ID',
      },
    ],
    responses: {
      200: {
        description: 'User found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'User not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};

export const updateUserDocs = {
  put: {
    summary: 'Update user',
    description: 'Updates user information. If email changes, a new hash and signature are generated',
    tags: ['Users'],
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid',
        },
        description: 'User ID',
      },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UpdateUserDto',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User updated successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                publicKey: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'User not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      409: {
        description: 'Email already in use',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};

export const deleteUserDocs = {
  delete: {
    summary: 'Delete user',
    description: 'Permanently deletes a user from the system',
    tags: ['Users'],
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid',
        },
        description: 'User ID',
      },
    ],
    responses: {
      200: {
        description: 'User deleted successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'User deleted successfully',
                },
                id: {
                  type: 'string',
                  format: 'uuid',
                },
              },
            },
          },
        },
      },
      404: {
        description: 'User not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
  },
};

export const exportUsersDocs = {
  get: {
    summary: 'Export users as Protobuf',
    description: 'Returns all users serialized in Protocol Buffer format (binary)',
    tags: ['Users'],
    responses: {
      200: {
        description: 'Protobuf binary data',
        headers: {
          'Content-Type': {
            schema: {
              type: 'string',
              example: 'application/x-protobuf',
            },
          },
          'X-Public-Key': {
            schema: {
              type: 'string',
            },
            description: 'Base64-encoded RSA public key',
          },
        },
        content: {
          'application/x-protobuf': {
            schema: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    },
  },
};

export const getPublicKeyDocs = {
  get: {
    summary: 'Get RSA public key',
    description: 'Returns the RSA public key used for signature verification',
    tags: ['Users'],
    responses: {
      200: {
        description: 'Public key in PEM format',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PublicKey',
            },
          },
        },
      },
    },
  },
};
