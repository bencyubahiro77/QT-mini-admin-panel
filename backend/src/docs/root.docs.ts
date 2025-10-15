export const rootEndpointDocs = {
  get: {
    summary: 'API Information',
    description: 'Returns information about the API, available endpoints, and features',
    tags: ['Info'],
    responses: {
      200: {
        description: 'API information',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Admin Panel API',
                },
                version: {
                  type: 'string',
                  example: '1.0.0',
                },
                description: {
                  type: 'string',
                  example: 'REST API with Protobuf serialization and RSA cryptographic signatures',
                },
                endpoints: {
                  type: 'object',
                  properties: {
                    health: {
                      type: 'string',
                      example: '/health',
                    },
                    docs: {
                      type: 'string',
                      example: '/api-docs',
                    },
                    api: {
                      type: 'string',
                      example: '/api/users',
                    },
                  },
                },
                features: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  example: [
                    'RSA-4096 Digital Signatures',
                    'SHA-384 Email Hashing',
                    'Protocol Buffers Serialization',
                    'RESTful CRUD Operations',
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
};
