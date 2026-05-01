# Módulo de Finanzas

El módulo de finanzas proporciona utilidades esenciales para la facturación electrónica y la gestión bancaria local.

## Importación

```typescript
import { amountToWords, getBankFromAccount } from 'gt-utils-js/finance';
```

## Funciones

### `amountToWords(amount: number): string`

Convierte un valor numérico a su representación legal en letras (español), la cual es obligatoria para la Facturación Electrónica en Línea (FEL) ante la SAT. Añade automáticamente los sufijos "QUETZALES EXACTOS" o "QUETZALES CON XX/100 CENTAVOS".

**Ejemplos:**
```typescript
import { amountToWords } from 'gt-utils-js/finance';

// Monto entero
console.log(amountToWords(150)); 
// "CIENTO CINCUENTA QUETZALES EXACTOS"

// Monto con decimales
console.log(amountToWords(150.50)); 
// "CIENTO CINCUENTA QUETZALES CON 50/100 CENTAVOS"

// Millones
console.log(amountToWords(2500500.25)); 
// "DOS MILLONES QUINIENTOS MIL QUINIENTOS QUETZALES CON 25/100 CENTAVOS"

// Valores nulos o fracciones pequeñas
console.log(amountToWords(0.99)); 
// "CERO QUETZALES CON 99/100 CENTAVOS"
```

---

### `getBankFromAccount(account: string): { bankName: string; bankCode: string; } | null`

Utiliza heurísticas basadas en la longitud y el dígito inicial de la cuenta bancaria para deducir a qué banco pertenece. Útil para validar o pre-rellenar formularios.
*Nota: Es heurístico, por lo que asume los formatos más comunes de cada entidad.*

**Ejemplos:**
```typescript
import { getBankFromAccount } from 'gt-utils-js/finance';

// Cuenta de Banrural (10 dígitos, empieza con 3 o 4)
console.log(getBankFromAccount('3123456789')); 
// { bankName: 'Banrural', bankCode: 'BANRURAL' }

// Cuenta de Banco Industrial (10 o 14 dígitos, empieza con 0 o 1)
console.log(getBankFromAccount('0123456789')); 
// { bankName: 'Banco Industrial', bankCode: 'BI' }

// Cuenta demasiado corta (Inválida)
console.log(getBankFromAccount('123')); 
// null
```
