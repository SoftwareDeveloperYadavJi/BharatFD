# Backend FAQ Service

This project is a backend service for managing FAQs, built with Node.js, Express, MongoDB, and Redis. It supports multilingual FAQs and uses Redis for caching to improve performance.

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

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

## Prerequisites

- Node.js (v14 or later)
- MongoDB
- Redis
- Docker (optional, for containerization)

## Setup Instructions

1. **Clone the Repository**
   ```bash
    git clone https://github.com/SoftwareDeveloperYadavJi/BharatFD
   
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy the `.env.example` to `.env` and fill in the necessary environment variables.
   - Example:
     ```
     MONGODB_URI=mongodb://localhost:27017/faqdb
     REDIS_URL=redis://localhost:6379
     PORT=3000
     ```

4. **Run the Application**
   - **Locally:**
     ```bash
     npm start
     ```
   - **With Docker:**
     ```bash
     docker-compose up --build
     ```

5. **Access the API**
   - The API will be available at `http://localhost:3000`.

## API Endpoints

### Authentication
- **Register User**
  - `POST /api/auth/register`
  - Request Body: 
    ```json
    {
      "email": "user@example.com",
      "password": "securePassword123",
      "name": "John Doe"
    }
    ```

- **Login**
  - `POST /api/auth/login`
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "securePassword123"
    }
    ```
  - Response: JWT token for authentication

### FAQ Management
- **Add FAQ**
  - `POST /api/faqs`
  - Auth: Required (Admin only)
  - Request Body:
    ```json
    {
      "question": "What is Node.js?",
      "answer": "Node.js is a JavaScript runtime.",
      "category": "technical",
      "tags": ["nodejs", "javascript"]
    }
    ```

- **Get FAQs**
  - `GET /api/faqs`
  - Query Parameters:
    - `lang`: Language code (e.g., 'en', 'es')
    - `category`: Filter by category
    - `page`: Page number for pagination
    - `limit`: Items per page
    - `search`: Search term for questions/answers

- **Get FAQ by ID**
  - `GET /api/faqs/:id`
  - Response: Single FAQ object

- **Update FAQ**
  - `PUT /api/faqs/:id`
  - Auth: Required (Admin only)
  - Request Body:
    ```json
    {
      "question": "Updated question",
      "answer": "Updated answer",
      "category": "updated-category",
      "tags": ["updated", "tags"]
    }
    ```

- **Delete FAQ**
  - `DELETE /api/faqs/:id`
  - Auth: Required (Admin only)

### Admin Operations
- **Get All Users**
  - `GET /api/admin/users`
  - Auth: Required (Admin only)
  - Query Parameters:
    - `page`: Page number
    - `limit`: Users per page

- **Update User Role**
  - `PUT /api/admin/users/:userId/role`
  - Auth: Required (Admin only)
  - Request Body:
    ```json
    {
      "role": "admin"
    }
    ```

### User Operations
- **Get User Profile**
  - `GET /api/users/profile`
  - Auth: Required

- **Update User Profile**
  - `PUT /api/users/profile`
  - Auth: Required
  - Request Body:
    ```json
    {
      "name": "Updated Name",
      "email": "newemail@example.com"
    }
    ```

- **Change Password**
  - `PUT /api/users/change-password`
  - Auth: Required
  - Request Body:
    ```json
    {
      "currentPassword": "oldPassword123",
      "newPassword": "newPassword123"
    }
    ```

### Response Formats
All API responses follow this structure:
```json
{
  "success": true,
  "data": {}, // Response data
  "message": "Operation successful",
  "error": null // Error message if any
}
```

### Error Handling
- 400: Bad Request - Invalid input
- 401: Unauthorized - Invalid/missing token
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource doesn't exist
- 500: Internal Server Error

## Architecture

The application follows a Model-View-Controller (MVC) architecture:
- **Models**: Define the data structure using Mongoose.
- **Controllers**: Handle the business logic and interact with models.
- **Routes**: Define the API endpoints and link them to controllers.
- **Services**: Integrate with external services like translation APIs.
- **Middlewares**: Handle cross-cutting concerns like caching.

## Deployment

- **Docker**: Use the provided `Dockerfile` and `docker-compose.yml` for containerized deployment.
- **Cloud Providers**: Can be deployed on platforms like AWS, Heroku, or DigitalOcean.
- **CI/CD**: Integrate with tools like GitHub Actions or Jenkins for automated deployment.

## Security Considerations

- **Environment Variables**: Use `.env` files to manage sensitive information.
- **Input Validation**: Ensure all inputs are validated to prevent injection attacks.
- **HTTPS**: Use HTTPS in production to secure data in transit.
- **Rate Limiting**: Implement rate limiting to prevent abuse of the API.

## Testing

- Run unit tests using:
  ```bash
  npm test
  ```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact nitiny1524@gmail.com 
