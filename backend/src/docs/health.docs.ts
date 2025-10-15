/**
 * Swagger Documentation for Health Endpoint
 */

export const healthCheckDocs = {
  get: {
    summary: 'Health check',
    description: 'Returns the health status of the API server',
    tags: ['Health'],
    responses: {
      200: {
        description: 'Server is healthy',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  example: 'healthy',
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                },
                uptime: {
                  type: 'number',
                  description: 'Server uptime in seconds',
                },
              },
            },
          },
        },
      },
    },
  },
};
