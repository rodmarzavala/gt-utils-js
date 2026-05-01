# Calendario y Feriados

Lógica matemática de días hábiles y asuetos nacionales de Guatemala, incluyendo el algoritmo "Computus" para calcular los asuetos móviles de Semana Santa sin requerir dependencias ni APIs externas.

## `isHoliday`

Verifica si una fecha corresponde a un feriado nacional guatemalteco.

**Reglas Soportadas:**
- Asuetos fijos (1 de Enero, 1 de Mayo, 15 de Septiembre, etc).
- Asuetos dinámicos (Jueves y Viernes Santo, calculados algorítmicamente mediante las fases lunares para cualquier año).
- Ley de Turismo Interno (Decreto 42-2010): Traslada el 30 de Junio al lunes correspondiente si cae en día hábil o fin de semana.

```typescript
import { isHoliday } from 'gt-utils-js/calendar';

const viernesSanto = new Date('2025-04-18T12:00:00');
console.log(isHoliday(viernesSanto)); // true

const junio30_domingo = new Date('2024-06-30T12:00:00');
console.log(isHoliday(junio30_domingo)); // false (Por Decreto 42-2010 se corrió al lunes)

const lunes1Julio = new Date('2024-07-01T12:00:00');
console.log(isHoliday(lunes1Julio)); // true
```

## `addBusinessDays`

Suma días hábiles a una fecha de inicio, saltándose inteligentemente los fines de semana y los asuetos nacionales aplicables en Guatemala.

```typescript
import { addBusinessDays } from 'gt-utils-js/calendar';

// Sumar 3 días hábiles a partir del Miércoles Santo (16 de Abril 2025)
// Saltará Jueves Santo, Viernes Santo, Sábado y Domingo.
const result = addBusinessDays(new Date('2025-04-16T12:00:00'), 3);
console.log(result.toDateString()); // Wed Apr 23 2025
```
