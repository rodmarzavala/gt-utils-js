# Módulo de Vehículos

El módulo de vehículos está diseñado para parsear (analizar) y validar estructuralmente las placas vehiculares, respetando estrictamente el reglamento de tránsito de Guatemala.

## Importación

```typescript
import { parseLicensePlate } from 'gt-utils-js/vehicles';
```

## Funciones

### `parseLicensePlate(plate: string): { isValid: boolean; type: string; number: string; letters: string; }`

Analiza un número de placa vehicular. 
La función extrae el `tipo` (ej. P, C, M, TC), el `número` correlativo y las `letras` finales.
**Regla crítica:** Este validador rechaza cualquier placa que contenga **VOCALES** (`A`, `E`, `I`, `O`, `U`) en el bloque final de letras, ya que el reglamento de tránsito prohíbe su uso para evitar palabras inapropiadas o malsonantes.

**Ejemplos:**
```typescript
import { parseLicensePlate } from 'gt-utils-js/vehicles';

// Placa Particular Correcta (Sin guion)
console.log(parseLicensePlate('P123BCD')); 
// { isValid: true, type: 'P', number: '123', letters: 'BCD' }

// Placa Comercial Correcta (Con guion)
console.log(parseLicensePlate('C-456FGH')); 
// { isValid: true, type: 'C', number: '456', letters: 'FGH' }

// Placa Inválida por tener una vocal en las letras finales
console.log(parseLicensePlate('P-123BCA')); 
// { isValid: false, type: 'P', number: '123', letters: 'BCA' }

// Placa Inválida por formato incorrecto
console.log(parseLicensePlate('XYZ-123')); 
// { isValid: false, type: '', number: '', letters: '' }
```
