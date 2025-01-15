# Contexto Técnico

## Arquitetura

### Frontend
- **Framework**: React 18 com TypeScript 4
- **UI Library**: Material-UI v5
- **Estado Global**: Context API
- **Roteamento**: React Router v6
- **Autenticação**: Auth0
- **HTTP Client**: Axios

### Backend
- **Framework**: .NET Core 7
- **ORM**: Entity Framework Core
- **Database**: SQL Server
- **Storage**: Minio para imagens
- **API Docs**: Swagger/OpenAPI

## Estrutura do Projeto

### Frontend
```
src/
├── components/     # Componentes reutilizáveis
├── context/       # Contextos globais
├── hooks/         # Hooks personalizados
├── pages/         # Páginas da aplicação
├── services/      # Serviços e APIs
├── types/         # Tipos e interfaces
└── utils/         # Utilitários
```

### Backend
```
src/
├── Controllers/   # Controllers da API
├── Models/        # Modelos de dados
├── Services/      # Lógica de negócio
├── Repositories/  # Acesso a dados
└── Middleware/    # Middlewares
```

## Fluxos Principais

### Autenticação
1. Login via Auth0
2. Obtenção de tokens
3. Verificação de roles
4. Redirecionamento baseado em permissões

### Gerenciamento de Itens
1. CRUD completo via API
2. Upload de imagens para Minio
3. Cache de dados no frontend
4. Validação em tempo real

### Carrinho de Compras
1. Persistência local
2. Sincronização com backend
3. Cálculos em tempo real
4. Checkout seguro

## Integrações

### Auth0
- Login social
- Gerenciamento de roles
- Tokens JWT
- Refresh token automático

### Minio
- Armazenamento de imagens
- CDN para delivery
- Backup automático
- Otimização de imagens

### API
- RESTful
- Versionada
- Rate limiting
- CORS configurado

## Segurança

### Autenticação
- JWT tokens
- Refresh tokens
- HTTPS obrigatório
- Proteção contra CSRF

### Autorização
- Roles baseados em claims
- Middleware de autorização
- Validação de tokens
- Auditoria de acessos

### Dados
- Sanitização de inputs
- Validação de dados
- Criptografia em trânsito
- Backup regular

## Performance

### Frontend
- Code splitting
- Lazy loading
- Caching de dados
- Otimização de imagens

### Backend
- Caching de queries
- Paginação
- Compressão de resposta
- Pooling de conexões

## Monitoramento

### Logs
- Erros do cliente
- Erros do servidor
- Acessos à API
- Performance metrics

### Métricas
- Tempo de resposta
- Taxa de erro
- Uso de recursos
- Acessos por rota

## Ambiente de Desenvolvimento

### Requisitos
- Node.js 16+
- .NET SDK 7
- SQL Server
- Docker

### Setup
1. Clone do repositório
2. Instalação de dependências
3. Configuração de variáveis de ambiente
4. Inicialização dos serviços

## Deployment

### Frontend
- Build otimizado
- Assets versionados
- CDN para estáticos
- Cache headers

### Backend
- Container Docker
- Load balancer
- Auto scaling
- Health checks

## Manutenção

### Backups
- Database: diário
- Imagens: semanal
- Logs: mensal
- Configurações: por mudança

### Updates
- Dependências: mensal
- Sistema: trimestral
- Segurança: imediato
- Framework: por LTS

## Frontend

### Tecnologias Principais
- React com TypeScript
- Material-UI para componentes
- Context API para gerenciamento de estado
- React Router para navegação
- Auth0 para autenticação

### Gerenciamento de Estado
- Context API para estado global
- useState e useReducer para estado local
- Gerenciamento de categorias centralizado
- Cache local para otimização

### Validação e Tipos
- TypeScript para tipagem estática
- Zod para validação de schemas
- Interfaces para modelos de dados
- Type guards para segurança de tipos

### Categorias e Itens
- Associação dinâmica entre itens e categorias
- Validação de tipos para categorias
- Cache de categorias para performance
- Atualização otimista de UI

## UI/UX Design

### Estilo Visual
- **Cores Principais**:
  - Amarelo Principal: #FFA500 (do logo)
  - Branco: #FFFFFF
  - Preto: #000000
  - Cinza Claro: #F5F5F5 (background)
  - Cinza Escuro: #333333 (textos)

### Layout
- **Header**:
  - Logo centralizado no topo
  - Menu de navegação horizontal abaixo do logo
  - Carrinho de compras no canto superior direito
  - Barra de busca integrada

### Menu/Cardápio
- **Categorização**:
  - Menu lateral fixo com categorias
  - Grid de produtos com 3 colunas
  - Cards de produtos com imagem, título e preço
  - Botão de "Visualização Rápida" no hover

### Cards de Produtos
- **Estrutura**:
  - Imagem do produto em destaque
  - Título em fonte elegante
  - Preço em destaque
  - Categoria em texto discreto
  - Botão de adicionar ao carrinho
  - Efeito de hover suave

### Tipografia
- **Fontes**:
  - Títulos: Playfair Display
  - Corpo: Roboto
  - Preços: Montserrat
  - Categorias: Roboto Condensed

### Elementos Interativos
- **Botões**:
  - Primário: Amarelo sólido (#FFA500)
  - Secundário: Transparente com borda
  - Hover: Escurecimento suave
  - Ripple effect no clique

### Responsividade
- **Breakpoints**:
  - Mobile: < 768px (1 coluna)
  - Tablet: 768px - 1024px (2 colunas)
  - Desktop: > 1024px (3 colunas)

### Animações
- **Transições**:
  - Menu dropdown suave
  - Fade in de imagens
  - Hover com scale suave
  - Loading states animados

### Elementos Especiais
- **Features**:
  - Modal de visualização rápida
  - Filtros de categoria com animação
  - Carrinho lateral deslizante
  - Notificações toast animadas
