import swaggerJsdoc from 'swagger-jsdoc';

const { PORT = 3000 } = process.env;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Appointment System API',
            version: '1.0.0',
            description: 'API to manage barbers and appointments with strong validation and conflict rules.',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Local server',
            },
        ],
        components: {
            schemas: {
                Barber: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        name: { type: 'string', example: 'John Wick' },
                        active: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Appointment: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
                        customerName: { type: 'string', example: 'Jane Doe' },
                        customerPhone: { type: 'string', example: '+1234567890' },
                        barberId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        start: { type: 'string', example: '2026-03-01 10:00', description: 'Format: YYYY-MM-DD HH:mm' },
                        durationMin: { type: 'number', enum: [30, 45, 60], example: 45 },
                        status: { type: 'string', enum: ['scheduled', 'cancelled'], example: 'scheduled' },
                        createdAt: { type: 'string', example: '2026-02-26 10:00' },
                        updatedAt: { type: 'string', example: '2026-02-26 10:00' }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js'], // Assuming routes will have annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
