# Technical Context

## Stack Atual
- .NET 9.0
- Entity Framework Core 9.0.0
- PostgreSQL 16
- Auth0 Authentication 1.1.0
- MinIO 6.0.4
- Swagger/OpenAPI
- Docker

## Arquitetura
### Camadas
1. **Presentation**
   - Controllers
   - DTOs
   - Middleware
   - Filters

2. **Business**
   - Services
   - Domain Models
   - Interfaces
   - Validators

3. **Data**
   - Entity Framework Core
   - Repositories
   - Migrations
   - Configurations

4. **Infrastructure**
   - MinIO Integration
   - Auth0 Integration
   - Logging
   - Caching

## Dependências Principais
```xml
<ItemGroup>
  <PackageReference Include="Auth0.AspNetCore.Authentication" Version="1.1.0" />
  <PackageReference Include="DotNetEnv" Version="3.1.1" />
  <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.0.0" />
  <PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.0" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.0" />
  <PackageReference Include="Minio" Version="6.0.4" />
  <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.0" />
  <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
</ItemGroup>
```

## Configuração de Ambiente

### Desenvolvimento
```bash
# Database
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=cuattro_dev;Username=postgres;Password=your_password;Ssl Mode=Prefer

# Auth0
Auth0__Domain=dev-domain.auth0.com
Auth0__ClientId=dev_client_id
Auth0__ClientSecret=dev_client_secret

# MinIO
MinIO__Endpoint=localhost:9000
MinIO__AccessKey=minioadmin
MinIO__SecretKey=minioadmin
MinIO__BucketName=cuattro-dev
```

### Produção
```bash
# Database
ConnectionStrings__DefaultConnection=Host=prod-db;Port=5432;Database=cuattro;Username=app_user;Password=secure_password;Ssl Mode=VerifyFull

# Auth0
Auth0__Domain=cuattro.auth0.com
Auth0__ClientId=prod_client_id
Auth0__ClientSecret=prod_client_secret

# MinIO
MinIO__Endpoint=s3api.4lumen.com
MinIO__AccessKey=prod_access_key
MinIO__SecretKey=prod_secret_key
MinIO__BucketName=cuattro-prod
```

## Segurança

### Auth0 Configuration
1. **Roles**
   - Administrador
   - Cliente
   - Empregado

2. **Permissions**
   - read:items
   - write:items
   - manage:users
   - process:orders

### SSL/TLS
- Certificados gerenciados pelo DigitalOcean
- HTTPS forçado em produção
- SSL para conexão com PostgreSQL

### CORS
- Frontend: https://cuattro.4lumen.com
- Dev: http://localhost:3000
- Métodos permitidos: GET, POST, PUT, DELETE
- Headers customizados configurados

## Deployment

### Docker
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["CuattroBackAPI.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CuattroBackAPI.dll"]
```

### CI/CD
- GitHub Actions para CI
- DigitalOcean App Platform para CD
- Testes automatizados (pendente)
- Code quality checks
- Security scanning
