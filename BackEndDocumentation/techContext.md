# Contexto Técnico

## Frontend (React + TypeScript)

### Estrutura de Componentes
- `AdminPage`: Interface de administração para gerenciamento de itens
  - Formulário de criação/edição
  - Lista de itens com preview
  - Upload de imagens
  - Validação de dados

### Serviços
- `itemService`: Gerenciamento de itens
  - CRUD completo
  - Upload de imagens
  - Integração com Minio
  - Tratamento de erros

### Autenticação
- Auth0 para gerenciamento de identidade
- Integração com Google OAuth
- Roles: Admin, Funcionário, Cliente
- Proteção de rotas baseada em roles

### Estado Global
- Context API para gerenciamento de estado
- Tipos fortemente tipados com TypeScript
- Ações assíncronas com feedback visual

## Backend (.NET Core)

### Endpoints
- `POST /api/Item`: Criar novo item
- `PUT /api/Item/{id}`: Atualizar item existente
- `POST /api/Item/{id}/imagem`: Upload de imagem
- `GET /api/Item`: Listar todos os itens
- `GET /api/Item/{id}`: Obter item específico

### Armazenamento
- SQL Server para dados
- Minio (S3) para imagens
- Entity Framework Core para ORM

### Segurança
- JWT para autenticação
- CORS configurado
- Validação de roles
- Sanitização de inputs

## Infraestrutura
- Docker para containerização
- Azure para hospedagem
- CI/CD com GitHub Actions
- Logs centralizados

## Padrões e Práticas
- Clean Architecture
- Repository Pattern
- Dependency Injection
- Error Handling padronizado
- Logging estruturado
- Validação em camadas
