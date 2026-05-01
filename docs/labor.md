# Laboral (Severance)

Motor que aplica el Código de Trabajo Guatemalteco para el cálculo exacto de prestaciones irrenunciables, incluyendo cálculo proporcional y la indemnización universal de Guatemala (Regla de 14 salarios / 12).

## `calculateSeverance`

Genera una proyección al centavo exacto de la liquidación laboral para un colaborador.

**Reglas Soportadas:**
- **Aguinaldo**: Prorrateado basado en días trabajados del 1 de Dic al 30 de Nov.
- **Bono 14**: Prorrateado basado en días trabajados del 1 de Jul al 30 de Jun.
- **Vacaciones**: Prorrateado calculando los días excedentes desde el último aniversario de inicio de labores.
- **Indemnización**: Solo aplica por `unjustified_dismissal`. Se paga a razón de $Salario Promedio \times \frac{14}{12}$ multiplicado por los días totales laborados.

```typescript
import { calculateSeverance } from 'gt-utils-js/labor';

const result = calculateSeverance({
  startDate: new Date('2023-01-01T00:00:00'),
  endDate: new Date('2024-06-30T00:00:00'), // 1.5 años después
  monthlySalary: 5000,
  reason: 'unjustified_dismissal' // O 'resignation'
});

console.log(result);
// {
//   aguinaldo: 2904.11,     // Días entre Dic 1 y Jun 30
//   bono14: 5000,           // Ciclo completo exacto
//   vacations: 1239.73,     // Días desde último aniversario
//   indemnizacion: 8726.03, // 14 salarios / 12 proporcional
//   daysWorkedAguinaldo: 212,
//   daysWorkedBono14: 365,
//   daysWorkedVacations: 181,
//   totalDaysWorked: 546,
//   totalToReceive: 17869.86
// }
```
