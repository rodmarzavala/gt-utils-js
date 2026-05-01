# gt-utils-js 

La biblioteca estándar definitiva, sin dependencias (Zero-Dependency) y con tipado estricto (TypeScript) para validaciones y utilidades específicas de Guatemala.

Optimizada para entornos Edge (Cloudflare Workers, Vercel Edge), Deno, Bun y Node.js. Todo el código, nombres de variables y API se mantienen estrictamente en inglés bajo principios de Clean Code, pero la lógica responde a la legislación y cultura de Guatemala.

## Instalación

```bash
npm install gt-utils-js
# o usando yarn
yarn add gt-utils-js
# o usando pnpm
pnpm add gt-utils-js
```

## Características Principales

Esta biblioteca provee 7 submódulos especializados:

-  **Identidad:** Validación rigurosa de NIT y CUI/DPI (Módulo 11 oficial de SAT y RENAP). Incluye la nueva disposición SAT 2025 donde los CUI válidos operan como NIT. Retorna el departamento y código de municipio emisor.
-  **Finanzas:** Conversión de números a letras para Facturación Electrónica (FEL) y detección de bancos por número de cuenta (G&T, Banrural, BI, BAM, Promerica, etc).
-  **Vehículos:** Analizador y validador de Placas Vehiculares (comerciales, particulares, motos, y reglas estrictas del reglamento de tránsito, como exclusiones de vocales O, I, Q, Ñ).
-  **Geografía:** Resolución Inversa Nacional: pasa coordenadas (Lat, Lng) y te dice en qué municipio y departamento de Guatemala caen (Ray-Casting algorithm ligero).
-  **Impuestos:** Retenciones de IVA y escalonadas de ISR (Régimen General > Q2,500) redondeadas al centavo contable exacto.
-  **Feriados y Calendario:** Algoritmo astronómico para cálculo de Semana Santa, listado de asuetos, y traslados de feriados largos de acuerdo a la Ley de Promoción de Turismo Interno (Decreto 19-2018 y CC).
-  **Laboral:** Calculadora de Liquidaciones al centavo. Determina fechas de corte y pagos proporcionales de Aguinaldo, Bono 14, Vacaciones y cálculo de indemnización por despido injustificado (regla de 14 salarios / 12 meses).

## Uso Rápido

La librería expone todas sus utilidades desde el punto de entrada principal.

```typescript
import { 
  isValidNit, 
  isValidCui, 
  getCuiInformation,
  calculateTaxes,
  calculateSeverance,
  getLicensePlateInfo,
  getHolidays,
  findMunicipalityByLatLng,
  amountToWords
} from 'gt-utils-js';

// 1. Identidad
console.log(isValidNit('123456-0')); // true
console.log(isValidCui('2548000090101')); // true
console.log(getCuiInformation('2548000090101')); 
// { isValid: true, department: 'Guatemala', municipalityId: 1 }

// 2. Impuestos y Facturación
console.log(amountToWords(150.50)); // "CIENTO CINCUENTA QUETZALES CON 50/100 CENTAVOS"
console.log(calculateTaxes({
  amount: 3000,
  regime: 'GENERAL',
  isRetentionAgent: true,
  currency: 'GTQ'
})); 
// { subtotal: 2678.57, iva: 321.43, retentionIsr: 133.93, retentionIva: 48.21, totalToReceive: 2817.86 }

// 3. Vehículos
console.log(parseLicensePlate('P-123BCD'));
// { isValid: true, type: 'P', number: '123', letters: 'BCD' }

// 4. Laboral
console.log(calculateSeverance({
  startDate: new Date('2022-01-01'),
  endDate: new Date('2023-12-31'),
  monthlySalary: 6000,
  reason: 'UNJUSTIFIED_FIRING'
}));
// { aguinaldo, bono14, vacations, indemnizacion: 14000, totalToReceive: 20501.37, ... }

// 5. Geografía (Coordenadas -> Municipio)
// Palacio Nacional
console.log(findMunicipalityByLatLng(14.643445, -90.513222));
// { name: 'Guatemala', department: 'Guatemala' }

// 6. Feriados
const holidays2024 = getHolidays(2024);
// Retorna todos los asuetos incluyendo fechas móviles (ej. 30 de junio movido a lunes)
```

## Documentación Detallada

- [Docs Oficiales](https://rodmarzavala.github.io/gt-utils-js) (Próximamente vía GitHub Pages)

## Tests

El paquete tiene una cobertura de pruebas exhaustiva. Para ejecutar las pruebas tú mismo:

```bash
pnpm install
pnpm test
```

También incluimos un archivo `playground.ts` que demuestra cada funcionalidad. Para correrlo:

```bash
npx tsx src/playground.ts
```

## Licencia

MIT
