export type Polygon = Array<[number, number]>; // Array of [longitude, latitude]

export interface MunicipalityFeature {
  name: string;
  department: string;
  polygon: Polygon;
}

import { MUNICIPALITIES_POLYGONS } from './polygons.js';

/**
 * Uses the Ray-Casting algorithm to determine if a point (lat, lng) is inside a polygon.
 * 
 * @param point - [longitude, latitude]
 * @param polygon - Array of [longitude, latitude] points forming the polygon boundary
 * @returns boolean indicating if the point is inside the polygon
 */
function isPointInPolygon(point: [number, number], polygon: Polygon): boolean {
  const [x, y] = point;
  let isInside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) {
      isInside = !isInside;
    }
  }

  return isInside;
}

/**
 * Finds the municipality containing the given latitude and longitude.
 * Currently uses a mock database for demonstration.
 * 
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns The municipality object or null if not found
 */
export function findMunicipalityByLatLng(lat: number, lng: number): Omit<MunicipalityFeature, 'polygon'> | null {
  const point: [number, number] = [lng, lat]; // GeoJSON typically uses [longitude, latitude] order

  for (const municipality of MUNICIPALITIES_POLYGONS) {
    if (isPointInPolygon(point, municipality.polygon)) {
      return {
        name: municipality.name,
        department: municipality.department
      };
    }
  }

  return null;
}
