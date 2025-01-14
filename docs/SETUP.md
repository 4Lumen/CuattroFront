# Configuração do Ambiente - Buffet App

## 🚀 Requisitos

### Software Necessário
- Node.js (versão 14 ou superior)
- npm (versão 6 ou superior) ou yarn
- Git
- VSCode (recomendado)

### Extensões Recomendadas para VSCode
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Material Icon Theme
- GitLens

## 💻 Instalação

### 1. Clone o Repositório
```bash
git clone [url-do-repositorio]
cd buffet-app
```

### 2. Instale as Dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
# API
REACT_APP_API_URL=http://localhost:3001

# Auth0
REACT_APP_AUTH0_DOMAIN=seu-dominio.auth0.com
REACT_APP_AUTH0_CLIENT_ID=seu-client-id
```

### 4. Inicie o Servidor de Desenvolvimento
```bash
npm start
# ou
yarn start
```

## ⚙️ Configuração do Editor

### ESLint
Arquivo `.eslintrc.js`:
```javascript
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/react-in-jsx-scope': 'off'
  }
};
```

### Prettier
Arquivo `.prettierrc`:
```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true
}
```

### VSCode Settings
Arquivo `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start           # Inicia o servidor de desenvolvimento
npm run build       # Cria build de produção
npm run test        # Executa os testes
npm run eject       # Ejeta as configurações do Create React App

# Qualidade de Código
npm run lint        # Executa o ESLint
npm run lint:fix    # Corrige problemas do ESLint
npm run format      # Formata o código com Prettier

# Outros
npm run analyze     # Analisa o bundle size
npm run typecheck   # Verifica tipos TypeScript
```

## 📦 Estrutura do Projeto

```
buffet-app/
├── docs/                    # Documentação
├── public/                  # Arquivos públicos
├── src/                     # Código fonte
│   ├── components/         # Componentes React
│   ├── context/           # Contextos da aplicação
│   ├── hooks/             # Hooks personalizados
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços e APIs
│   ├── types/             # Tipos TypeScript
│   ├── utils/             # Funções utilitárias
│   ├── App.tsx            # Componente principal
│   └── index.tsx          # Ponto de entrada
├── .env                    # Variáveis de ambiente
├── .eslintrc.js           # Configuração do ESLint
├── .prettierrc            # Configuração do Prettier
├── package.json           # Dependências e scripts
├── tailwind.config.js     # Configuração do Tailwind
└── tsconfig.json          # Configuração do TypeScript
```

## 🔒 Segurança

### Auth0
1. Crie uma conta no [Auth0](https://auth0.com)
2. Crie uma nova aplicação
3. Configure as URLs permitidas:
   - Allowed Callback URLs: `http://localhost:3000/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

### API
1. Configure o CORS no backend
2. Use HTTPS em produção
3. Implemente rate limiting
4. Valide tokens JWT

## 🐛 Debugging

### Chrome DevTools
1. Instale React Developer Tools
2. Use a aba Components para inspecionar
3. Use a aba Network para debugar requisições

### VSCode
1. Instale a extensão Debugger for Chrome
2. Configure o launch.json:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## 📱 Desenvolvimento Mobile

### Responsividade
1. Use as classes do Tailwind:
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Conteúdo */}
</div>
```

### PWA
1. Atualize o manifest.json
2. Configure o service worker
3. Teste em diferentes dispositivos

## 🚀 Deploy

### Build de Produção
```bash
# Crie a build
npm run build

# Teste localmente
npx serve -s build
```

### Otimizações
1. Configure o cache-control
2. Use CDN para assets
3. Comprima imagens
4. Habilite gzip/brotli

## 🧪 Ambiente de Testes

### Jest
1. Configure o jest.config.js:
```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};
```

### Testing Library
1. Use queries por role/text
2. Evite testar implementação
3. Teste comportamento do usuário 