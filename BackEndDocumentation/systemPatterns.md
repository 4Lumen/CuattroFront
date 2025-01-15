# System Patterns

## Architecture Overview
- Layered architecture with clear separation of concerns
- Presentation Layer: Controllers and API endpoints
- Business Logic Layer: Domain models and services
- Data Access Layer: Entity Framework Core repositories
- Storage Layer: MinIO S3 for file storage

## Design Patterns
1. Repository Pattern
   - Entity Framework Core for data access
   - Generic repository for common operations
   - Specialized repositories for complex queries

2. Service Pattern
   - Business logic encapsulation
   - Cross-cutting concerns handling
   - Service lifetime management

3. Factory Pattern
   - Object creation abstraction
   - Complex object initialization
   - Configuration-based factories

4. Strategy Pattern
   - Authentication providers
   - File storage providers
   - Payment processing

5. Unit of Work
   - Transaction management
   - Data consistency
   - Atomic operations

## Database Design
- Code First approach with Entity Framework Core
- PostgreSQL with SSL encryption
- Entity relationships:
  - One-to-Many: Usuario to Carrinho
  - Many-to-Many: Carrinho to Item through ItemCarrinho
- Optimized indexes
- Data integrity constraints
- Soft delete implementation

## Security Patterns
- JWT-based authentication with Auth0
- Role-based authorization
- Input validation and sanitization
- SSL/TLS encryption
- Secure file storage with MinIO
- Environment variable management
- Secrets handling

## API Design
- RESTful principles
- Resource-based routing
- Consistent response formats
- Error handling standardization
- Swagger documentation
- CORS configuration

## File Storage
- MinIO S3 integration
- Automatic URL generation
- File type validation
- Size restrictions
- Secure access control
- Cleanup procedures

## Deployment
- Docker containerization
- Environment-based configuration
- Health checks
- Logging strategy
- Monitoring setup
- Backup procedures
