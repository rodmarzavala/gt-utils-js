#  Módulo de Geografía (Geo)

Este submódulo te permite hacer resolución inversa (Reverse Geocoding) localmente, ¡sin depender de APIs de Google Maps o Mapbox y de forma completamente offline! Utiliza el algoritmo matemático **Ray-Casting** para determinar si unas coordenadas caen dentro de los polígonos de Guatemala.

## Importación

```typescript
import { findMunicipalityByLatLng } from 'gt-utils-js';
```

## `findMunicipalityByLatLng(lat, lng)`

Dado un punto con Latitud y Longitud, devuelve el **Departamento y Municipio** exacto donde se encuentra.

### Parámetros

- `lat` *(number)*: Latitud del punto (Ej. `14.643445`).
- `lng` *(number)*: Longitud del punto (Ej. `-90.513222`).

### Retorno

Retorna un objeto con la información del municipio o `null` si las coordenadas caen fuera de las fronteras de Guatemala o en el mar.

```typescript
type MunicipalityResult = {
  name: string;
  department: string;
} | null;
```

---

##  Ejemplos de Uso

A continuación se presentan varios ejemplos prácticos que te ayudarán a entender cómo implementar esto en aplicaciones reales, como aplicaciones de delivery, sistemas de logística, o controles de fraude.

### 1. Saber desde dónde pide un usuario (Delivery / Ecommerce)
En un sistema de ecommerce o aplicación de entregas, recibes las coordenadas del GPS del celular del usuario.

```typescript
import { findMunicipalityByLatLng } from 'gt-utils-js';

// Coordenadas recibidas del teléfono del cliente
const userLat = 14.834720;
const userLng = -91.518300;

const location = findMunicipalityByLatLng(userLat, userLng);

if (location) {
  console.log(`El pedido se entregará en: ${location.name}, ${location.department}`);
  // Salida: El pedido se entregará en: Quetzaltenango, Quetzaltenango
} else {
  console.log('Lo sentimos, actualmente solo hacemos entregas dentro del territorio de Guatemala.');
}
```

### 2. Validar que un evento ocurrió en la ciudad capital
Imagina que ofreces una promoción válida únicamente para residentes o visitas a la ciudad capital (Municipio de Guatemala). 

```typescript
// Coordenadas del Palacio Nacional
const location = findMunicipalityByLatLng(14.643445, -90.513222);

if (location?.name === 'Guatemala' && location?.department === 'Guatemala') {
  console.log('¡Promoción aplicada! Estás en la capital.');
}
```

### 3. Exclusión de ubicaciones falsas (Anti-Spoofing / Seguridad)
Si tienes un sistema bancario o de fraude, puedes detectar instantáneamente si unas coordenadas están fuera del país sin hacer llamadas a red, reduciendo la latencia a 0 milisegundos.

```typescript
// Alguien tratando de usar la app bancaria "desde Guatemala", 
// pero sus coordenadas son de la Torre Eiffel en París.
const isInsideGuatemala = findMunicipalityByLatLng(48.8584, 2.2945);

if (!isInsideGuatemala) {
  // Dispara alerta de fraude
  console.error("ALERTA DE SEGURIDAD: Operación bloqueada. El dispositivo no se encuentra en territorio nacional.");
}
```

## Beneficios de este Módulo
- **Velocidad Extrema:** Funciona haciendo matemáticas de vértices de polígonos. Retorna el resultado en menos de 0.05ms.
- **Sin Costo:** No pagarás $0.005 por cada request a Google Maps API de "Reverse Geocoding".
- **Zero Dependencies:** Es completamente Edge-friendly, listo para usarse en Cloudflare Workers, Vercel o Next.js Middleware.
