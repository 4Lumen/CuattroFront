# Technical Context

## Technologies Used
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
- Modular controller structure
- Asynchronous programming model

## Development Setup
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
5. Configure connection string in appsettings.json with SSL certificate

## API Structure
### Controllers
- ItemController: Manages menu items
- CarrinhoController: Handles shopping cart operations
- ItemCarrinhoController: Manages items within carts
- UsuarioController: Handles user management and roles

## Security
- JWT-based authentication via Auth0
- Role-based authorization
- SSL encryption for database connections
- Input validation and error handling

## Environment Configuration
The application uses a .env-dev file for development environment variables. This file should contain all necessary configuration values and should not be committed to version control.

### .env-dev File Structure
```plaintext
# Development Environment Variables
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
1. Create a .env-dev file with the required environment variables
2. Build the application:
   ```bash
   dotnet publish -c Release -o ./publish
   ```
3. Run the application:
   ```bash
   dotnet CuattroBackAPI.dll
   ```
4. Access Swagger UI at: http://localhost:5041/swagger
5. Use Auth0 authentication for protected endpoints

## Important Notes
- Add .env-dev to your .gitignore file to prevent sensitive information from being committed
- The application uses the DotNetEnv package to load environment variables
- For production, use actual environment variables or a secure secrets management system

## Environment Variables
Required for production deployment:
- ASPNETCORE_ENVIRONMENT: Production
- ConnectionStrings__DefaultConnection: PostgreSQL connection string
  Format: Host=hostname;Port=port;Database=dbname;Username=user;Password=password;Ssl Mode=VerifyFull
- Auth0__Domain: Your Auth0 domain
- Auth0__ClientId: Your Auth0 client ID
- Auth0__ClientSecret: Your Auth0 client secret
- MinIO__Endpoint: MinIO server endpoint
- MinIO__AccessKey: MinIO access key
- MinIO__SecretKey: MinIO secret key

## DigitalOcean App Platform Deployment
The application is hosted at: https://api.cuattro.4lumen.com/

1. Create a new App in DigitalOcean App Platform
2. Connect your GitHub repository
3. Configure the required environment variables
4. The app will automatically build and deploy using the Dockerfile
5. Configure custom domain (optional)
6. Set up database:
   - Create a managed PostgreSQL database in DigitalOcean
   - Add the connection string to environment variables
7. Configure scaling:
   - Minimum: 1 instance
   - Maximum: 3 instances (based on traffic)

## Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Swagger UI for manual testing
- Postman collections for API testing
