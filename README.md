# AceWatch Frontend 🎾

Interface moderna e responsiva do AceWatch desenvolvida com React 18 e Tailwind CSS. Dashboard completo para acompanhar partidas de tênis em tempo real, gerenciar favoritos e configurar alertas.

## 🔧 Tecnologias

- **React 18** - Biblioteca JavaScript moderna
- **Vite** - Build tool ultra-rápida
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento declarativo
- **Axios** - Cliente HTTP
- **Lucide React** - Biblioteca de ícones
- **Context API** - Gerenciamento de estado global

## ✨ Funcionalidades

### 🔐 Autenticação

- **Login/Registro** com validação em tempo real
- **JWT Token** armazenado localmente
- **Auto-logout** quando token expira
- **Proteção de rotas** privadas

### 📊 Dashboard

- **Partidas ao vivo** com indicadores visuais
- **Partidas agendadas** com horários
- **Resultados recentes** organizados
- **Filtros avançados** por status e data
- **Refresh manual** dos dados

### ⭐ Sistema de Favoritos

- **Adicionar/remover** partidas favoritas
- **Lista organizada** de favoritos
- **Acesso rápido** pelo ícone ❤️

### 🔔 Alertas Inteligentes

- **Criar alertas** para eventos específicos
- **Editar/desativar** alertas existentes
- **Tipos de trigger**: início, tie-break, terceiro set, fim
- **Gerenciamento completo** na página dedicada

### 📱 Design Responsivo

- **Mobile-first** approach
- **Breakpoints otimizados** para todos os dispositivos
- **Menu hambúrguer** em telas pequenas
- **Cards adaptáveis** ao espaço disponível

## 🚀 Instalação Local

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Core API rodando na porta 8000

### 1. Clone e Configure

```bash
git clone <url-do-repositorio>
cd acewatch-frontend

# Instalar dependências
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
# Editar .env:
# VITE_API_URL=http://localhost:8000
```

### 3. Executar em Desenvolvimento

```bash
# Modo desenvolvimento
npm run dev

# Aplicação disponível em http://localhost:5173
```

### 4. Build para Produção

```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

## 🐳 Docker

### Dockerfile Multi-stage

O Dockerfile utiliza build multi-stage para otimizar o tamanho final:

```dockerfile
# Stage 1: Build da aplicação
FROM node:18-alpine as build
# ... build process ...

# Stage 2: Servidor Nginx
FROM nginx:alpine
# ... serve static files ...
```

### Executar com Docker

```bash
# Construir imagem
docker build -t acewatch-frontend .

# Executar container
docker run -d \
  --name acewatch-frontend \
  -p 3000:80 \
  acewatch-frontend
```

## 🎨 Design System

### Cores Personalizadas

```css
/* Paleta AceWatch */
--ace-green: #10B981    /* Verde tênis */
--ace-blue: #3B82F6     /* Azul primário */
--ace-purple: #8B5CF6   /* Roxo destaque */
--ace-orange: #F59E0B   /* Laranja alerta */
```

### Componentes Customizados

```css
.match-card          /* Cards de partidas */
/* Cards de partidas */
.match-card-live     /* Indicador ao vivo */
.status-live         /* Badge de status live */
.status-finished     /* Badge de status finalizado */
.ace-gradient; /* Gradiente da marca */
```

### Animações

- **Pulse lento** para indicadores ao vivo
- **Bounce suave** para alertas ativos
- **Hover effects** em cards e botões
- **Loading spinners** personalizados

## 📁 Estrutura de Arquivos

```
acewatch-frontend/
├── public/
│   └── favicon.ico         # Ícone da aplicação
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Navbar.jsx     # Barra de navegação
│   │   └── MatchCard.jsx  # Card de partida
│   ├── contexts/          # Contextos React
│   │   └── AuthContext.jsx # Autenticação global
│   ├── pages/             # Páginas da aplicação
│   │   ├── Dashboard.jsx  # Página principal
│   │   ├── Login.jsx      # Tela de login
│   │   ├── Register.jsx   # Tela de registro
│   │   ├── Favorites.jsx  # Gerenciar favoritos
│   │   └── Alerts.jsx     # Gerenciar alertas
│   ├── services/          # Serviços de API
│   │   ├── api.js         # Cliente HTTP base
│   │   ├── authService.js # Serviços de auth
│   │   └── matchService.js # Serviços de partidas
│   ├── App.jsx            # Componente raiz
│   ├── App.css           # Estilos globais
│   ├── index.css         # Tailwind + customizações
│   └── main.jsx          # Entry point
├── Dockerfile            # Container Docker
├── nginx.conf           # Configuração Nginx
├── package.json         # Dependências e scripts
├── tailwind.config.js   # Configuração Tailwind
├── vite.config.js       # Configuração Vite
└── README.md           # Este arquivo
```

## 🔄 Fluxo de Dados

### Autenticação

```
Login/Register → AuthService → JWT Token → LocalStorage → AuthContext → Protected Routes
```

### Dados das Partidas

```
Dashboard → matchService → Core API → PostgreSQL → Response → UI Update
```

### WebSocket (Futuro)

```
Core API → WebSocket → Frontend → Real-time Updates → UI Refresh
```

## 📊 Componentes Principais

### AuthContext

```jsx
// Gerencia estado global de autenticação
const { user, isAuthenticated, login, logout } = useAuth();
```

### MatchCard

```jsx
// Exibe informações de uma partida
<MatchCard
  match={matchData}
  onFavoriteUpdate={handleFavorite}
  onAlertUpdate={handleAlert}
/>
```

### Navbar

```jsx
// Navegação responsiva com menu mobile
<Navbar />
```

## 🎯 Funcionalidades Detalhadas

### Dashboard

- **Grid responsivo** de cards de partidas
- **Separação por status**: Live, Agendadas, Finalizadas
- **Filtros em tempo real** por data e status
- **Indicadores visuais** para partidas ao vivo
- **Botão refresh** com loading state

### Sistema de Favoritos

- **Ícone coração** em cada card
- **Estado visual** (preenchido/vazio)
- **Lista dedicada** na página Favorites
- **Remoção rápida** com confirmação

### Alertas Avançados

- **Múltiplos tipos** de trigger
- **Ativação/desativação** individual
- **Edição inline** dos alertas
- **Status visual** (ativo/inativo)

### Responsividade

```css
/* Breakpoints Tailwind */
sm:  640px   /* Tablet pequeno */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Desktop grande */
```

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento

# Build
npm run build        # Build para produção
npm run preview      # Preview do build

# Linting
npm run lint         # ESLint
npm run lint:fix     # Fix automático

# Testes (se implementados)
npm run test         # Jest/Vitest
npm run test:watch   # Modo watch
```

## 🔧 Configurações

### Vite Config

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8000", // Proxy para desenvolvimento
    },
  },
});
```

### Tailwind Config

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "ace-green": "#10B981",
        "ace-blue": "#3B82F6",
        // ... cores customizadas
      },
    },
  },
};
```

### Nginx Config (Produção)

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://core-api:8000/;
    }
}
```

## 📱 UX/UI Decisions

### Loading States

- **Skeletons** para carregamento inicial
- **Spinners** para ações específicas
- **Disabled states** durante requisições
- **Toast notifications** para feedback

### Error Handling

- **Fallbacks visuais** para erros de rede
- **Retry automático** em falhas temporárias
- **Mensagens claras** para o usuário
- **Estados vazios** bem designados

### Acessibilidade

- **Contraste adequado** em todos os elementos
- **Focus states** visíveis
- **Alt texts** em imagens
- **Navegação por teclado** funcional

## 🚨 Troubleshooting

### Problemas Comuns

1. **API não conecta**

   ```
   Error: Network Error
   ```

   - Verificar se Core API está rodando
   - Conferir VITE_API_URL no .env
   - Checar CORS na API

2. **Rotas não funcionam**

   ```
   404 Not Found após refresh
   ```

   - Configurar nginx para SPA
   - Verificar react-router setup

3. **Build falha**
   ```
   Error: Module not found
   ```
   - Verificar imports relativos
   - Checar case-sensitivity nos nomes

### Debug

```bash
# Logs de desenvolvimento
npm run dev -- --debug

# Inspecionar bundle
npm run build -- --analyze

# Verificar dependências
npm ls
```

## 🎨 Customização

### Temas

O design suporta expansão para temas:

```css
/* Futuro suporte a dark mode */
.dark .match-card {
  @apply bg-gray-800 text-white;
}
```

### Componentes

Todos os componentes são modulares e reutilizáveis:

```jsx
// Exemplo: Novo componente de estatísticas
import MatchCard from "./MatchCard";
import StatsWidget from "./StatsWidget";
```

## 📋 Roadmap

### Próximas Funcionalidades

- [ ] **Dark mode** toggle
- [ ] **PWA** capabilities
- [ ] **Offline support** básico
- [ ] **Push notifications**
- [ ] **Compartilhamento** de partidas
- [ ] **Estatísticas detalhadas**

### Melhorias Técnicas

- [ ] **Testes unitários** (Jest/Testing Library)
- [ ] **Testes E2E** (Cypress/Playwright)
- [ ] **Storybook** para componentes
- [ ] **Bundle optimization**
- [ ] **Lazy loading** de rotas

---

🎾 **AceWatch Frontend** - Onde o tênis ganha vida na sua tela!
