---
layout: home

hero:
  name: "gt-utils-js"
  text: "Utilidades Estándar de Guatemala"
  tagline: Zero-Dependency, TypeScript-first, Edge-Ready
  actions:
    - theme: brand
      text: Instalación
      link: /installation
    - theme: alt
      text: Ver en GitHub
      link: https://github.com/rodmarzavala/gt-utils-js

features:
  - title: Identidad
    details: Comprueba DPI y NIT según reglas SAT.
    link: /identity
  - title: Finanzas y Bancos
    details: Conversión a letras para FEL y heurísticas de cuentas.
    link: /finance
  - title: Vehículos
    details: Valida placas de acuerdo al reglamento de tránsito.
    link: /vehicles
  - title: Geografía
    details: Identificación de municipios por lat/lng.
    link: /geo
  - title: Impuestos
    details: Retenciones escalonadas de IVA e ISR.
    link: /taxes
  - title: Feriados y Calendario
    details: Feriados dinámicos (Semana Santa) y Ley de Turismo Interno.
    link: /holidays
  - title: Laboral
    details: Aguinaldo, Bono 14, e indemnizaciones.
    link: /labor
---

## Instalación Rápida

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

```typescript
import { isValidNIT, isValidDPI } from '@rodmarzavala/gt-utils-js';

// o importando desde submódulos
import { calculateSeverance } from '@rodmarzavala/gt-utils-js/labor';

console.log(isValidNIT("7780969-6")); // true
```
