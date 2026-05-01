# Impuestos (Taxes)

Módulo encargado de la lógica tributaria guatemalteca, aplicando reglas de la SAT y la Ley de Actualización Tributaria.

## `calculateTaxes`

Calcula retenciones de ISR e IVA automáticamente, ideal para facturación electrónica o contabilidad.

**Reglas Aplicadas (Régimen General Opcional Simplificado):**
- Si el cliente es Agente de Retención y el subtotal es $\ge$ Q2,500:
  - Retiene el 15% del IVA.
  - Retiene ISR escalonado: 5% sobre los primeros Q30,000, y 7% sobre el excedente (más importe fijo de Q1,500).

```typescript
import { calculateTaxes } from 'gt-utils-js/taxes';

const breakdown = calculateTaxes({
  amount: 44800, // Total de la factura (con IVA incluido)
  regime: 'GENERAL', // 'GENERAL' o 'SMALL_TAXPAYER'
  isRetentionAgent: true
});

console.log(breakdown);
// Salida:
// {
//   subtotal: 40000,
//   iva: 4800,
//   retentionIsr: 2200, // (40000 - 30000) * 0.07 + 1500
//   retentionIva: 720,  // 4800 * 0.15
//   totalToReceive: 41880
// }
```
