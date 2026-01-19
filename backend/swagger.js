
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info:{
            title: 'AIBA Backend API',
            version: '1.0.0',
            description: 'Authentication API for AIBA Backend',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
        components:{
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./routes/*.js"],
}

module.exports = swaggerJSDoc(options);