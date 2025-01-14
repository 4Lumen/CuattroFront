# Buffet App

## 📝 Descrição
Aplicação web para gerenciamento de buffet, desenvolvida com React, TypeScript, Material-UI e Auth0. Sistema completo para gerenciamento de cardápio, pedidos e usuários.

## 🚀 Funcionalidades

### Para Clientes
- Visualização do cardápio com categorias e imagens
- Carrinho de compras intuitivo
- Sistema de autenticação via Google
- Acompanhamento de pedidos em tempo real

### Para Funcionários
- Gerenciamento de pedidos em tempo real
- Atualização de status de pedidos
- Controle de entregas e agendamentos

### Para Administradores
- Gestão completa do cardápio (CRUD)
- Upload e gerenciamento de imagens
- Gerenciamento de usuários e permissões
- Relatórios e análises de vendas

## 🛠️ Tecnologias

### Frontend
- React 18
- TypeScript 4
- Material-UI v5
- Auth0 para autenticação
- Context API para estado global
- Axios para requisições HTTP

### Backend
- .NET Core
- Entity Framework Core
- SQL Server
- Minio para armazenamento de imagens
- Swagger para documentação da API

## 🎨 Design System

### Cores
- **Primária**: #1976d2 (Azul)
- **Secundária**: #dc004e (Rosa)
- **Tons de Cinza**: Escala Material Design
- Suporte a modo escuro nativo

### Componentes
- Cards com preview de imagens
- Formulários com validação em tempo real
- Tabelas com ações contextuais
- Layout totalmente responsivo

## 🏗️ Estrutura do Projeto

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

## 💻 Pré-requisitos

- Node.js 16+
- npm ou yarn
- Conta no Auth0
- Acesso ao backend .NET

## 🚀 Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/buffet-app.git
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

4. Inicie o servidor de desenvolvimento
```bash
npm start
```

## 🔒 Variáveis de Ambiente

```env
REACT_APP_API_URL=https://api.cuattro.4lumen.com
REACT_APP_AUTH0_DOMAIN=seu-dominio.auth0.com
REACT_APP_AUTH0_CLIENT_ID=seu-client-id
REACT_APP_AUTH0_AUDIENCE=https://api.cuattro.4lumen.com
```

## 📦 Estrutura de Dados

### User
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

### Item
```typescript
interface Item {
  id: number;
  nome: string | null;
  descricao: string | null;
  preco: number;
  imagemUrl: string;
  categoria: string;
  itensCarrinho?: ItemCarrinho[];
}
```

### Carrinho
```typescript
interface Carrinho {
  id: number;
  usuarioId: string;
  dataCriacao: string;
  dataEntrega?: string;
  localEntrega?: string;
  status: Status;
  itensCarrinho?: ItemCarrinho[];
}
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
```bash
git checkout -b feature/MinhaFeature
```
3. Commit suas mudanças
```bash
git commit -m 'Adiciona nova feature'
```
4. Push para a branch
```bash
git push origin feature/MinhaFeature
```
5. Abra um Pull Request

## 📝 Documentação

- [Documentação Técnica](./BackEndDocumentation/techContext.md)
- [Padrões do Sistema](./BackEndDocumentation/systemPatterns.md)
- [Progresso do Projeto](./BackEndDocumentation/progress.md)
- [Configuração Auth0](./BackEndDocumentation/Auth0Settings.pdf)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
