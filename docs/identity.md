#  Módulo de Identidad

El módulo de identidad provee funciones robustas para validar los documentos de identificación y registros tributarios de Guatemala, sin requerir internet para consultar bases de datos externas.

## Importación

```typescript
import { isValidNit, isValidCui, getCuiInformation } from 'gt-utils-js';
```

---

##  Ejemplos de Uso

### 1. Registrar a un nuevo usuario en tu App
Al momento en el que el usuario llena el formulario de registro, puedes validar en milisegundos que su DPI o NIT sea verdadero, incluso obteniendo información adicional para precargarle datos.

```typescript
import { isValidCui, getCuiInformation, isValidNit } from 'gt-utils-js';

const userInputDpi = '1234567890101';
const userInputNit = '123456-0';

if (!isValidCui(userInputDpi)) {
  console.log("Error: El DPI ingresado no es válido.");
} else {
  // Pre-llenar el departamento en tu formulario
  const info = getCuiInformation(userInputDpi);
  console.log(`Hola usuario del departamento de: ${info.department}`); 
  // Salida: Hola usuario del departamento de: Guatemala
}

if (!isValidNit(userInputNit)) {
  console.log("Error: El NIT ingresado es inválido");
}
```

### 2. Validar NIT bajo las nuevas reglas SAT (2025 en adelante)
Con la facturación electrónica y las actualizaciones del gobierno, el número de CUI ahora puede operar oficialmente como NIT si el usuario así lo registra.
Nuestra librería verifica si la cadena introducida es un NIT válido y, de no serlo, prueba matemáticamente si es un CUI válido de 13 dígitos.

```typescript
// Un CUI ingresado en el campo de NIT de tu formulario de Facturación (FEL)
const nitInput = '1234567890101'; 

if (isValidNit(nitInput)) {
  console.log("El NIT es un CUI de 13 dígitos válido.");
}
```

---

## Funciones Principales

### `isValidCui(cui: string): boolean`

Valida un Código Único de Identificación (CUI / DPI). Utiliza el algoritmo matemático de **Módulo 11** para comprobar el dígito verificador, y valida que el código de departamento (dígitos 10 y 11) y municipio (dígitos 12 y 13) existan realmente de acuerdo al registro del RENAP.

**Ejemplos:**
```typescript
// DPI matemáticamente válido (Dígito verificador: 9)
console.log(isValidCui('1234567890101')); // true

// DPI inválido por mal dígito verificador (8 en lugar de 9)
console.log(isValidCui('1234567880101')); // false

// DPI inválido por departamento que no existe (ej. 23)
console.log(isValidCui('1234567892301')); // false
```

---

### `getCuiInformation(cui: string)`

A partir de un CUI válido, extrae información geográfica según los estándares del RENAP. 

```typescript
const info = getCuiInformation('1234567890101');
console.log(info);
/*
{
  isValid: true,
  department: 'Guatemala',
  municipalityId: 1
}
*/
```

---

### `isValidNit(nit: string): boolean`

Valida un Número de Identificación Tributaria (NIT). 
Incluye soporte para el **formato tradicional** (ej. `123456-0`) y soporte explícito para la **normativa SAT 2025**.

**Ejemplos:**
```typescript
// NIT tradicional con guion
console.log(isValidNit('123456-0')); // true

// NIT tradicional sin guion
console.log(isValidNit('1234560')); // true

// NIT inválido por mal dígito verificador
console.log(isValidNit('123456-1')); // false
```
