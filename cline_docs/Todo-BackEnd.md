# Todo Backend

## Endpoints a Serem Criados

### Categoria
1. **GET /api/Categoria**
   - Lista todas as categorias disponíveis
   - Response: `Categoria[]`
   ```typescript
   interface Categoria {
     id: number;
     nome: string;
     descricao?: string;
     ordem: number;
     ativa: boolean;
   }
   ```

2. **POST /api/Categoria**
   - Cria uma nova categoria
   - Requer role: Admin
   - Request body: `Categoria`
   - Response: `Categoria`

3. **PUT /api/Categoria/{id}**
   - Atualiza uma categoria existente
   - Requer role: Admin
   - Request body: `Categoria`
   - Response: 204 No Content

4. **DELETE /api/Categoria/{id}**
   - Desativa uma categoria (soft delete)
   - Requer role: Admin
   - Response: 204 No Content

### Pedido
1. **POST /api/Pedido**
   - Cria um novo pedido a partir de um carrinho
   - Request body:
   ```typescript
   interface NovoPedido {
     carrinhoId: number;
     enderecoEntrega: string;
     dataEntrega: string;
     observacoes?: string;
     formaPagamento: FormaPagamento;
   }
   ```

2. **GET /api/Pedido**
   - Lista pedidos com filtros
   - Query params: status, dataInicio, dataFim, cliente
   - Response: `Pedido[]`

3. **GET /api/Pedido/{id}**
   - Obtém detalhes de um pedido específico
   - Response: `Pedido`

4. **PUT /api/Pedido/{id}/status**
   - Atualiza o status de um pedido
   - Requer role: Admin ou Funcionario
   - Request body: `{ status: Status, observacao?: string }`

5. **GET /api/Pedido/cliente/{clienteId}**
   - Lista pedidos de um cliente específico
   - Response: `Pedido[]`

### Dashboard
1. **GET /api/Dashboard/metricas**
   - Obtém métricas gerais do sistema
   - Requer role: Admin
   - Response:
   ```typescript
   interface Metricas {
     vendasHoje: number;
     vendasMes: number;
     pedidosPendentes: number;
     clientesAtivos: number;
   }
   ```

2. **GET /api/Dashboard/vendas**
   - Obtém relatório de vendas com filtros
   - Query params: periodo, categoria, cliente
   - Requer role: Admin
   - Response: `RelatorioVendas`

### Usuário
1. **GET /api/Usuario/todos**
   - Lista todos os usuários (com paginação)
   - Requer role: Admin
   - Query params: page, size, role, search
   - Response: `PaginatedResponse<Usuario>`

2. **PUT /api/Usuario/{id}/status**
   - Ativa/desativa um usuário
   - Requer role: Admin
   - Request body: `{ ativo: boolean }`

3. **GET /api/Usuario/perfil**
   - Obtém perfil detalhado do usuário atual
   - Response: `PerfilUsuario`

## Modificações Necessárias

### Item
1. **Adicionar campos**
   ```typescript
   interface Item {
     // Campos existentes...
     categoria: string;      // Adicionar
     disponivel: boolean;    // Adicionar
     destaque: boolean;      // Adicionar
     ordem: number;         // Adicionar
     tags: string[];       // Adicionar
   }
   ```

2. **Novos endpoints**
   - `PUT /api/Item/{id}/disponibilidade`
   - `PUT /api/Item/{id}/destaque`
   - `GET /api/Item/categoria/{categoria}`
   - `GET /api/Item/destaques`

### Carrinho
1. **Adicionar campos**
   ```typescript
   interface Carrinho {
     // Campos existentes...
     cupomDesconto?: string;    // Adicionar
     valorDesconto: number;     // Adicionar
     valorTotal: number;        // Adicionar
     observacoes?: string;      // Adicionar
   }
   ```

2. **Novos endpoints**
   - `POST /api/Carrinho/{id}/aplicar-cupom`
   - `DELETE /api/Carrinho/{id}/remover-cupom`
   - `PUT /api/Carrinho/{id}/observacoes`

### ItemCarrinho
1. **Adicionar campos**
   ```typescript
   interface ItemCarrinho {
     // Campos existentes...
     observacoes?: string;      // Adicionar
     valorUnitario: number;     // Adicionar
     valorTotal: number;        // Adicionar
   }
   ```

## Melhorias Gerais

### Segurança
1. **Rate Limiting**
   - Implementar limite de requisições por IP/usuário
   - Configurar headers de rate limit
   - Adicionar proteção contra DDoS

2. **Validação**
   - Implementar FluentValidation para todos os modelos
   - Adicionar validação de formato de imagens
   - Validar tamanho máximo de uploads

### Performance
1. **Caching**
   - Implementar cache distribuído com Redis
   - Cachear consultas frequentes
   - Adicionar ETags para recursos estáticos

2. **Queries**
   - Otimizar consultas com Include
   - Implementar paginação em todas as listas
   - Adicionar índices apropriados

### Logs
1. **Auditoria**
   - Registrar todas as alterações em entidades
   - Logging de ações administrativas
   - Histórico de alterações de status

2. **Monitoramento**
   - Implementar health checks
   - Adicionar métricas de performance
   - Logging estruturado com Serilog 