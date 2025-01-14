# Buffet App

## 📝 Descrição
Aplicação web para gerenciamento de pedidos de buffet, desenvolvida com React, TypeScript, Material-UI e Tailwind CSS.

## 🚀 Funcionalidades

### Para Clientes
- Visualização do cardápio com categorias
- Carrinho de compras
- Sistema de autenticação
- Acompanhamento de pedidos

### Para Funcionários
- Gerenciamento de pedidos
- Atualização de status
- Controle de entregas

### Para Administradores
- Gestão completa do cardápio
- Gerenciamento de usuários
- Relatórios e análises

## 🛠️ Tecnologias

- React
- TypeScript
- Material-UI
- Tailwind CSS
- React Router
- Context API

## 🎨 Design System

### Cores
- **Primária**: Rosa (#FF6B6B)
- **Secundária**: Turquesa (#4ECDC4)
- **Tons de Cinza**: Escala personalizada
- Suporte a modo escuro

### Componentes
- Cards com sombras e animações
- Botões interativos
- Filtros de categoria
- Layout responsivo

## 🏗️ Estrutura do Projeto

```
src/
├── components/      # Componentes reutilizáveis
├── context/        # Contextos da aplicação
├── hooks/          # Hooks personalizados
├── pages/          # Páginas da aplicação
├── services/       # Serviços e APIs
├── types/          # Tipos e interfaces
└── theme.ts        # Configuração do tema
```

## 💻 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🚀 Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento
```bash
npm start
# ou
yarn start
```

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_URL=sua_url_api
REACT_APP_AUTH0_DOMAIN=seu_dominio_auth0
REACT_APP_AUTH0_CLIENT_ID=seu_client_id_auth0
```

## 📦 Estrutura de Dados

### User
```typescript
interface User {
  id: string;
  nome: string;
  email: string;
  role: Role;
}
```

### Item
```typescript
interface Item {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  categoria: string;
}
```

### Carrinho
```typescript
interface Carrinho {
  id: number;
  usuarioId: string;
  dataCriacao: string;
  status: Status;
  itensCarrinho: ItemCarrinho[];
}
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

# Cuattro - Sistema de Buffet

## Configuração do Auth0

### 1. Configuração no Dashboard do Auth0

1. **Criar uma Aplicação**:
   - Acesse https://manage.auth0.com/
   - Vá em "Applications" > "Create Application"
   - Nome: "Cuattro"
   - Tipo: Single Page Application
   - Clique em "Create"

2. **Configurar a Aplicação**:
   - Em "Settings", configure:
   ```
   Allowed Callback URLs: http://localhost:3000
   Allowed Logout URLs: http://localhost:3000
   Allowed Web Origins: http://localhost:3000
   ```

3. **Configurar a API**:
   - Vá em "APIs" > "Create API"
   - Nome: "Cuattro API"
   - Identifier: https://api.cuattro.4lumen.com
   - Signing Algorithm: RS256

4. **Configurar Roles**:
   - Vá em "User Management" > "Roles"
   - Crie três roles:
     ```
     Admin (2)
     Funcionário (1)
     Cliente (0)
     ```

5. **Configurar Action**:
   - Vá em "Actions" > "Library"
   - Clique em "Build Custom"
   - Nome: "Add Roles to Tokens"
   - Trigger: "Login / Post Login"
   - Cole o código:
   ```javascript
   exports.onExecutePostLogin = async (event, api) => {
       const namespace = 'https://api.cuattro.4lumen.com';

       // Verifica se o email está verificado
       if (!event.user.email || !event.user.email_verified) {
           return api.access.deny('Email não verificado');
       }

       // Define os roles baseado no email do usuário
       let userRole = 0; // Cliente por padrão

       // Lista de emails de admin e funcionários
       const adminEmails = (event.secrets.ADMIN_EMAILS || '').split(',').map(email => email.trim());
       const employeeEmails = (event.secrets.EMPLOYEE_EMAILS || '').split(',').map(email => email.trim());

       if (adminEmails.includes(event.user.email)) {
           userRole = 2; // Admin
       } else if (employeeEmails.includes(event.user.email)) {
           userRole = 1; // Funcionário
       }

       // Adiciona o role aos tokens
       api.idToken.setCustomClaim(`${namespace}/roles`, [userRole]);
       api.accessToken.setCustomClaim(`${namespace}/roles`, [userRole]);

       // Adiciona metadados ao usuário se necessário
       if (!event.user.user_metadata?.role) {
           await api.user.setUserMetadata('role', userRole);
       }
   };
   ```

6. **Configurar Secrets na Action**:
   - Na Action, vá para "Secrets"
   - Adicione:
   ```
   ADMIN_EMAILS: email1@exemplo.com,email2@exemplo.com
   EMPLOYEE_EMAILS: funcionario1@exemplo.com,funcionario2@exemplo.com
   ```

### 2. Configuração no Projeto

1. **Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   # API Configuration
   REACT_APP_API_URL=https://api.cuattro.4lumen.com

   # Auth0 Configuration
   REACT_APP_AUTH0_DOMAIN=seu-tenant.region.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=seu-client-id
   REACT_APP_AUTH0_AUDIENCE=https://api.cuattro.4lumen.com

   # Role Constants
   REACT_APP_ROLE_ADMIN=2
   REACT_APP_ROLE_EMPLOYEE=1
   REACT_APP_ROLE_CUSTOMER=0
   ```

2. **Fluxo de Autenticação**:
   - O usuário acessa a aplicação
   - Se não estiver autenticado, é redirecionado para o Auth0
   - Após autenticação, retorna para a aplicação
   - O sistema verifica o role do usuário e redireciona para a página apropriada

3. **Roles e Permissões**:
   ```typescript
   enum Role {
     Cliente = 0,
     Funcionario = 1,
     Admin = 2
   }
   ```

4. **Estrutura do Usuário**:
   ```typescript
   interface User {
     id: string;
     auth0Id: string;
     nome: string | null;
     email: string | null;
     role: Role;
     picture?: string;
   }
   ```

## Desenvolvimento

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

### Scripts Disponíveis
- `npm start`: Inicia o servidor de desenvolvimento
- `npm build`: Cria a versão de produção
- `npm test`: Executa os testes
- `npm run lint`: Executa o linter

## Troubleshooting

### Problemas Comuns

1. **Loop de Redirecionamento**:
   - Limpe o cache do navegador
   - Limpe o localStorage:
   ```javascript
   localStorage.clear()
   ```
   - Reinicie o servidor de desenvolvimento

2. **Erro de Autenticação**:
   - Verifique as configurações no Auth0 Dashboard
   - Confirme se o email está verificado
   - Verifique os logs no console

3. **Erro de Role**:
   - Verifique se o email está na lista correta na Action
   - Confirme se a Action está configurada corretamente
   - Verifique o namespace dos roles

## Segurança

1. **Tokens**:
   - Access Token: Para acessar a API
   - ID Token: Para informações do usuário
   - Refresh Token: Para renovar o acesso

2. **Proteção de Rotas**:
   - Todas as rotas protegidas verificam autenticação
   - Roles são verificados para acesso a áreas restritas

3. **Boas Práticas**:
   - Tokens armazenados no localStorage
   - Refresh tokens habilitados
   - CORS configurado corretamente
   - SSL/TLS obrigatório em produção
