# Instalación

Instala el paquete en tu proyecto usando tu manejador de paquetes favorito:

::: code-group

```bash [npm]
npm install @rodmarzavala/gt-utils-js
```

```bash [yarn]
yarn add @rodmarzavala/gt-utils-js
```

```bash [pnpm]
pnpm add @rodmarzavala/gt-utils-js
```

```bash [bun]
bun add @rodmarzavala/gt-utils-js
```

:::

## Uso Básico

Una vez instalado, puedes importar los módulos que necesites de forma individual o desde el punto de entrada principal. El paquete provee tipado completo de TypeScript.

```typescript
import { isValidNit, isValidCui } from '@rodmarzavala/gt-utils-js';
// o importando desde submódulos
import { isValidNit } from '@rodmarzavala/gt-utils-js/identity';

console.log(isValidNit("123456-0")); // true
```
