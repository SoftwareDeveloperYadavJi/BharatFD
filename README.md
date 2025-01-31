# Backend FAQ Service



## Project Structure
```
backend-faq-service/
│── src/
│   ├── config/          # Configuration files
│   │   ├── db.js        # MongoDB connection
│   │   ├── cache.js     # Redis caching setup
│   │   ├── dotenv.js    # Environment variables
│   ├── models/          # Mongoose data models
│   │   ├── faqModel.js  # FAQ schema
│   ├── routes/          # API route definitions
│   │   ├── faqRoutes.js # FAQ endpoint routes
│   ├── controllers/     # Business logic
│   │   ├── faqController.js # FAQ operations
│   ├── middlewares/     # Express middlewares
│   │   ├── cacheMiddleware.js # Caching logic
│   ├── services/        # External service integrations
│   │   ├── translation.js # Google Translate API
│   ├── tests/           # Unit testing
│   │   ├── faq.test.js  # FAQ unit tests
│   ├── app.js           # Express application setup
│── public/              # Static file storage
│── Dockerfile           # Docker containerization
│── docker-compose.yml   # Multi-container setup
│── .env                 # Environment configuration
│── package.json         # Project dependencies
│── README.md            # Project documentation
```
