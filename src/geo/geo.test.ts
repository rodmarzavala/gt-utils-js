import { describe, expect, test, it } from 'vitest';
import { departments, findMunicipalityByLatLng } from './index.js';

describe('Geo Module', () => {
  describe('departments', () => {
    it('contains exactly 22 departments', () => {
      expect(departments).toHaveLength(22);
    });

    test.each([
      [1, 'Guatemala'],
      [3, 'Sacatepéquez'],
      [17, 'Petén'],
      [22, 'Jutiapa'],
    ])('Department ID %i is %s', (id, expectedName) => {
      const dept = departments.find(d => d.id === id);
      expect(dept?.name).toBe(expectedName);
    });
  });

  describe('findMunicipalityByLatLng (Ray-Casting algorithm)', () => {
    test.each([
      // [lat, lng, Expected Municipality]
      [14.60, -90.50, 'Guatemala'],         // Center-ish of Guatemala poly
      [14.67, -90.56, 'Mixco'],             // Bordering municipality (Mixco)
      [14.55, -90.73, 'Antigua Guatemala'], // Center of Antigua poly
      [14.54, -90.74, 'Antigua Guatemala'], // Edge of mock Antigua poly
      [15.00, -89.00, null],                // Deep outside any defined polys
      [0.00, 0.00, null],                   // Null island
    ])('Point [lat: %f, lng: %f] -> %s', (lat, lng, expectedMunicipality) => {
      const res = findMunicipalityByLatLng(lat, lng);
      if (expectedMunicipality === null) {
        expect(res).toBeNull();
      } else {
        expect(res?.name).toBe(expectedMunicipality);
      }
    });
  });
});
