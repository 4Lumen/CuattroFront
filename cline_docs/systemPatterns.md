# System Patterns

## Architecture Overview
- Layered architecture with clear separation of concerns
- Presentation Layer: React components and API endpoints
- Business Logic Layer: Services and Context API
- Data Access Layer: Entity Framework Core repositories

## Frontend Patterns
1. Component-based architecture
2. Context API for state management
3. Custom hooks for reusable logic
4. Higher-order components for role-based access
5. Error boundary components
6. Lazy loading for performance optimization

## Backend Patterns
1. Repository Pattern: Abstracting data access logic
2. Dependency Injection: For loose coupling and testability
3. Unit of Work: Managing database transactions
4. Strategy Pattern: For different authentication providers
5. Factory Pattern: For creating complex objects
6. Image Upload Pattern: Using MinIO S3 for file storage

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
- Protected routes in frontend
- CSRF protection

## API Design Principles
- RESTful conventions
- Versioning support
- Consistent error handling
- Pagination and filtering
- Caching strategies
- Rate limiting

## Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for React
- End-to-end tests for user flows
- Mocking dependencies for isolated testing
- Automated test suites
- Continuous integration pipeline
