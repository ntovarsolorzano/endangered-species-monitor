export interface Species {
  id: string;
  name: string;
  scientificName: string;
  status: 'CR' | 'EN' | 'VU' | 'NT' | 'LC'; // Critically Endangered, Endangered, Vulnerable, Near Threatened, Least Concern
  description: string;
  imageUrl: string;
  population?: string; // e.g. "Fewer than 100"
}

export interface UserImpact {
  userId: string;
  actionsTaken: string[];
  carbonFootprintReduced: number; // in kg
  donations: number; // in currency unit
}
