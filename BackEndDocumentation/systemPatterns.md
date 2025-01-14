# System Patterns

## Architecture Overview
- Layered architecture with clear separation of concerns
- Presentation Layer: Controllers and API endpoints
- Business Logic Layer: Domain models and services
- Data Access Layer: Entity Framework Core repositories

## Design Patterns
1. Repository Pattern: Abstracting data access logic
2. Dependency Injection: For loose coupling and testability
3. Unit of Work: Managing database transactions
4. Strategy Pattern: For different authentication providers
5. Factory Pattern: For creating complex objects
6. Image Upload Pattern: Using MinIO S3 for file storage with automatic URL generation

## Database Design
- Code First approach with Entity Framework Core
- PostgreSQL relational database
- Entity relationships:
  - One-to-Many: Usuario to Carrinho
  - Many-to-Many: Carrinho to Item through ItemCarrinho
- Indexes for frequently queried fields
- Constraints for data integrity

## Security Patterns
- JWT-based authentication
- Role-based authorization
- Input validation and sanitization
- SSL encryption for data in transit
- Secure password hashing

## API Design Principles
- RESTful conventions
- Versioning support
- Consistent error handling
- Pagination and filtering
- Caching strategies

## Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- Mocking dependencies for isolated testing
- Automated test suites
- Continuous integration pipeline
