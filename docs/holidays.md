# 📆 Módulo de Feriados y Calendario Legal

Este submódulo es una maravilla de la matemática y legislación local. Contiene el **Algoritmo Astronómico de Computus** para calcular fechas movibles basadas en la luna (como la Semana Santa) y aplica de forma automática la **Ley que Promueve el Turismo Interno** de Guatemala, con sus modificaciones por la Corte de Constitucionalidad.

## Importación

```typescript
import { getHolidays, isHoliday, getNextHoliday } from 'gt-utils-js';
```

---

## 💡 Ejemplos de Uso

### 1. Saber tu próximo asueto
Si estás construyendo una aplicación de RH (Recursos Humanos) o quieres mostrarle a tu usuario cuándo es su próximo día de descanso.

```typescript
import { getNextHoliday } from 'gt-utils-js';

// Retorna el siguiente asueto nacional desde el día de hoy
const next = getNextHoliday();
console.log(`Tu próximo descanso es: ${next.name} el ${next.date.toLocaleDateString()}`);
// Salida: Tu próximo descanso es: Día del Trabajo el 1/5/2026
```

### 2. Verificar traslados legales de descansos largos (Fines de semana largos)
En Guatemala, según las sentencias recientes de la Corte de Constitucionalidad, únicamente el **Día del Ejército (30 de junio)** es móvil.
Nuestra librería aplica la matemática de la ley de forma transparente: 
- Martes o Miércoles -> Pasa al Lunes anterior.
- Jueves, Viernes, Sábado o Domingo -> Pasa al Lunes siguiente.

```typescript
import { getHolidays } from 'gt-utils-js';

// El 30 de junio de 2024 cayó domingo. 
// La librería automáticamente lo movió al lunes 1 de julio.
const holidays2024 = getHolidays(2024);
const ejercito = holidays2024.find(h => h.name === 'Día del Ejército');

console.log(`El asueto se dará el: ${ejercito.date.toLocaleDateString()}`); // Lunes 1 de julio
console.log(`Originalmente era el: ${ejercito.originalDate.toLocaleDateString()}`); // Domingo 30 de junio
```

### 3. Evitar enviar notificaciones o cobranzas en días festivos
Si estás programando cronjobs de envío masivo de correos de cobro o quieres evitar llamar a tus clientes en Semana Santa o Navidad.

```typescript
import { isHoliday } from 'gt-utils-js';

const targetDate = new Date(); // El día que el cronjob se ejecuta

// isHoliday() detecta automáticamente fechas móviles como Jueves o Viernes Santo.
if (isHoliday(targetDate)) {
  console.log('Hoy es día de asueto nacional, pausaremos los cobros y llamadas.');
} else {
  console.log('Procesando correos...');
}
```

## Funciones Principales

### `getHolidays(year)`
Devuelve un listado completo (array) ordenado cronológicamente de todos los feriados nacionales.

### `isHoliday(date)`
Revisa si una instancia de objeto `Date` es exactamente uno de los asuetos nacionales aplicables en Guatemala.

### `getNextHoliday(fromDate?)`
Devuelve el objeto del próximo feriado. Si no se pasa fecha, toma el día de hoy.
