# Padrões do Sistema

## 🎨 Design System

### Cores
```css
/* Primárias */
--primary-50: #FFF5F5;
--primary-100: #FFE3E3;
--primary-200: #FFC9C9;
--primary-300: #FFA8A8;
--primary-400: #FF8787;
--primary-500: #FF6B6B;  /* Base */
--primary-600: #FA5252;
--primary-700: #F03E3E;
--primary-800: #E03131;
--primary-900: #C92A2A;

/* Secundárias */
--secondary-50: #E3FAFC;
--secondary-100: #C5F6FA;
--secondary-200: #99E9F2;
--secondary-300: #66D9E8;
--secondary-400: #3BC9DB;
--secondary-500: #22B8CF;  /* Base */
--secondary-600: #15AABF;
--secondary-700: #1098AD;
--secondary-800: #0C8599;
--secondary-900: #0B7285;

/* Tons de Cinza */
--gray-50: #F8F9FA;
--gray-100: #F1F3F5;
--gray-200: #E9ECEF;
--gray-300: #DEE2E6;
--gray-400: #CED4DA;
--gray-500: #ADB5BD;
--gray-600: #868E96;
--gray-700: #495057;
--gray-800: #343A40;
--gray-900: #212529;
```

### Tipografia
```css
/* Família */
font-family: 'Inter', sans-serif;

/* Tamanhos */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Pesos */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Espaçamento
```css
/* Escala de 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Sombras
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Bordas
```css
--radius-sm: 0.125rem;  /* 2px */
--radius: 0.25rem;      /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;
```

## 🧱 Componentes

### Botões
```typescript
// Variantes
type ButtonVariant = 'contained' | 'outlined' | 'text';

// Tamanhos
type ButtonSize = 'small' | 'medium' | 'large';

// Cores
type ButtonColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning';
```

### Cards
```typescript
// Variantes
type CardVariant = 'elevation' | 'outlined';

// Props
interface CardProps {
  variant?: CardVariant;
  elevation?: number;
  className?: string;
  children: React.ReactNode;
}
```

### Inputs
```typescript
// Variantes
type InputVariant = 'outlined' | 'filled' | 'standard';

// Props
interface InputProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}
```

## 📱 Breakpoints

```typescript
const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px'
};

// Uso com Tailwind
// sm: min-width: 600px
// md: min-width: 960px
// lg: min-width: 1280px
// xl: min-width: 1920px
```

## 🎭 Animações

```css
/* Fade */
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-in;
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 300ms ease-out;
}

/* Slide */
.slide-enter {
  transform: translateX(100%);
}
.slide-enter-active {
  transform: translateX(0);
  transition: transform 300ms ease-in;
}
.slide-exit {
  transform: translateX(0);
}
.slide-exit-active {
  transform: translateX(-100%);
  transition: transform 300ms ease-out;
}
```

## 🌗 Modo Escuro

```typescript
// Cores adaptativas
const darkTheme = {
  background: {
    default: '#121212',
    paper: '#1E1E1E'
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)'
  }
};

// Uso com Tailwind
// dark:bg-gray-900
// dark:text-white
```
