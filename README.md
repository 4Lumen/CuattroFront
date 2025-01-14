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
