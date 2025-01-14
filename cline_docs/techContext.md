# Technical Context

## Full Stack Technologies

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Axios for API communication
- React Testing Library for testing
- ESLint and Prettier for code quality

### Backend
- .NET 9.0
- Entity Framework Core (Code First)
- PostgreSQL
- Auth0 for authentication and authorization
- Swagger/OpenAPI for documentation
- Npgsql (PostgreSQL .NET driver)
- SSL for secure database connections
- MinIO S3 for image storage

## Architecture
- RESTful API design
- Repository pattern with Entity Framework Core
- Role-based access control
- Modular component structure
- Asynchronous programming model
- JWT-based authentication
- Context API for frontend state management

## Development Setup

### Frontend Setup
1. Install Node.js (v18+)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in .env file:
   ```plaintext
   REACT_APP_API_URL=http://localhost:5041
   REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=your_client_id
   REACT_APP_AUTH0_AUDIENCE=your_api_audience
   ```

### Backend Setup
1. Install .NET SDK 9.0
2. Set up PostgreSQL database with SSL connection
3. Configure Auth0 application with required roles:
   - Administrador
   - Cliente
   - Empregado
4. Install required NuGet packages:
   ```bash
   dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
   dotnet add package Auth0.AspNetCore.Authentication
   dotnet add package Swashbuckle.AspNetCore
   ```

## Environment Configuration

### Frontend .env File
```plaintext
REACT_APP_API_URL=http://localhost:5041
REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your_client_id
REACT_APP_AUTH0_AUDIENCE=your_api_audience
```

### Backend .env-dev File
```plaintext
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=cuattro_dev;Username=postgres;Password=your_password;Ssl Mode=Prefer
Auth0__Domain=your-domain.auth0.com
Auth0__ClientId=your_client_id
Auth0__ClientSecret=your_client_secret
MinIO__Endpoint=s3api.4lumen.com
MinIO__AccessKey=your_minio_access_key
MinIO__SecretKey=your_minio_secret_key
```

## Running the Application

### Frontend
1. Start development server:
   ```bash
   npm start
   ```
2. Access application at: http://localhost:3000

### Backend
1. Build the application:
   ```bash
   dotnet publish -c Release -o ./publish
   ```
2. Run the application:
   ```bash
   dotnet CuattroBackAPI.dll
   ```
3. Access Swagger UI at: http://localhost:5041/swagger

## Testing

### Frontend
- Unit tests with React Testing Library
- Component tests
- End-to-end tests with Cypress
- Accessibility testing with Axe

### Backend
- Unit tests for business logic
- Integration tests for API endpoints
- Swagger UI for manual testing
- Postman collections for API testing

## Deployment

### Frontend
- Build production version:
  ```bash
  npm run build
  ```
- Serve using Nginx or similar
- Configure CI/CD pipeline

### Backend
- Docker containerization
- CI/CD pipeline setup
- Production environment configuration
- Security hardening
- Automated testing suite

## Important Notes
- Add .env and .env-dev to .gitignore
- Use environment variables for all sensitive configuration
- Implement proper error boundaries in React components
- Use React.memo and useCallback for performance optimization
- Configure proper CORS settings in backend
