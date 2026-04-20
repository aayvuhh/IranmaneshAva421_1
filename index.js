const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://my-mongodb:27017/orderSystem');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const swaggerOptions = {
    swaggerDefinition: {
        swagger: '1.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation using Swagger',
        },
        host: `localhost:${PORT}`,
        basePath: '/',
        definitions: {
            Customer: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                    name: {
                        type: 'string',
                        description: 'The name of the customer',
                    },
                    email: {
                        type: 'string',
                        description: 'The email of the customer',
                    },
                },
                example: {
                    name: 'Ava Iranmanesh',
                    email: 'ami5520@psu.edu',
                },
            },
            Order: {
                type: 'object',
                required: ['customerId', 'items', 'totalAmount'],
                properties: {
                    customerId: {
                        type: 'string',
                        description: 'The ID of the customer who placed the order',
                    },
                    items: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                        description: 'List of items in the order',
                    },
                    totalAmount: {
                        type: 'number',
                        description: 'Total amount for the order',
                    },
                    status: {
                        type: 'string',
                        enum: ['Pending', 'Paid', 'Cancelled'],
                        description: 'Status of the order',
                    },
                    paymentMethod: {
                        type: 'string',
                        description: 'Payment method used for the order',
                    },
                },
                example: {
                    customerId: '507f1f77bcf86cd799439022',
                    items: ['Product 1', 'Product 2'],
                    totalAmount: 100.00,
                    status: 'Pending',
                    paymentMethod: 'Credit Card',
                },
            },
            PaymentBody: {
                type: 'object',
                properties: {
                    paymentMethod: {
                        type: 'string',
                        description: 'Payment method used for the order',
                    },
                },
                example: {
                    paymentMethod: 'Credit Card',
                },
            },
        },
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
        },
    },
    apis: ['./routes/orders.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const orderRoutes = require('./routes/orders.js');
app.use('/', orderRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});