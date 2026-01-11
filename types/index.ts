export type ModelStatus = 'pending' | 'in_progress' | 'delivered' | 'cancelled';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  photoUrl?: string;
  isVip: boolean;
  isFavorite: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Model {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  photoUrls: string[];
  status: ModelStatus;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeasurementType {
  id: string;
  name: string;
  unit: string;
  createdAt: string;
}

export interface Measurement {
  id: string;
  modelId: string;
  measurementTypeId: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface Creation {
  id: string;
  name: string;
  description?: string;
  photoUrls: string[];
  tags: string[];
  createdAt: string;
}

export interface AppData {
  clients: Client[];
  models: Model[];
  measurementTypes: MeasurementType[];
  measurements: Measurement[];
  creations: Creation[];
}
