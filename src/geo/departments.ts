export interface Department {
  id: number;
  name: string;
  municipalityCount?: number;
}

/**
 * The 22 geographical departments of Guatemala.
 */
export const departments: Department[] = [
  { id: 1, name: "Guatemala", municipalityCount: 17 },
  { id: 2, name: "El Progreso", municipalityCount: 8 },
  { id: 3, name: "Sacatepéquez", municipalityCount: 16 },
  { id: 4, name: "Chimaltenango", municipalityCount: 16 },
  { id: 5, name: "Escuintla", municipalityCount: 13 },
  { id: 6, name: "Santa Rosa", municipalityCount: 14 },
  { id: 7, name: "Sololá", municipalityCount: 19 },
  { id: 8, name: "Totonicapán", municipalityCount: 8 },
  { id: 9, name: "Quetzaltenango", municipalityCount: 24 },
  { id: 10, name: "Suchitepéquez", municipalityCount: 21 },
  { id: 11, name: "Retalhuleu", municipalityCount: 9 },
  { id: 12, name: "San Marcos", municipalityCount: 30 },
  { id: 13, name: "Huehuetenango", municipalityCount: 32 },
  { id: 14, name: "Quiché", municipalityCount: 21 },
  { id: 15, name: "Baja Verapaz", municipalityCount: 8 },
  { id: 16, name: "Alta Verapaz", municipalityCount: 17 },
  { id: 17, name: "Petén", municipalityCount: 14 },
  { id: 18, name: "Izabal", municipalityCount: 5 },
  { id: 19, name: "Zacapa", municipalityCount: 11 },
  { id: 20, name: "Chiquimula", municipalityCount: 11 },
  { id: 21, name: "Jalapa", municipalityCount: 7 },
  { id: 22, name: "Jutiapa", municipalityCount: 17 }
];
