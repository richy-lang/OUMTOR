import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback } from 'react';
import type { Client, Model, Measurement, MeasurementType, Creation, AppData } from '@/types';

const STORAGE_KEY = '@oumtor_data';

const initialData: AppData = {
  clients: [],
  models: [],
  measurementTypes: [],
  measurements: [],
  creations: [],
};

export const [DataProvider, useData] = createContextHook(() => {
  const [data, setData] = useState<AppData>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const migrateOldMeasurements = useCallback((oldData: any): AppData => {
    const measurementTypes: MeasurementType[] = [];
    const measurements: Measurement[] = [];
    const models: Model[] = [...(oldData.models || [])];

    const standardFields = [
      { name: 'Poitrine', field: 'chest', unit: 'cm' },
      { name: 'Taille', field: 'waist', unit: 'cm' },
      { name: 'Hanches', field: 'hips', unit: 'cm' },
      { name: 'Longueur bras', field: 'armLength', unit: 'cm' },
      { name: 'Longueur jambes', field: 'legLength', unit: 'cm' },
      { name: 'Largeur épaules', field: 'shoulderWidth', unit: 'cm' },
      { name: 'Cou', field: 'neck', unit: 'cm' },
    ];

    const typeMap = new Map<string, string>();
    standardFields.forEach((field, index) => {
      const typeId = `type_${index}`;
      typeMap.set(field.field, typeId);
      measurementTypes.push({
        id: typeId,
        name: field.name,
        unit: field.unit,
        createdAt: new Date().toISOString(),
      });
    });

    if (oldData.measurements && Array.isArray(oldData.measurements)) {
      oldData.measurements.forEach((oldMeasurement: any) => {
        let modelId = oldMeasurement.modelId;
        
        if (!modelId && oldMeasurement.clientId) {
          const defaultModel: Model = {
            id: `model_migrated_${oldMeasurement.clientId}`,
            clientId: oldMeasurement.clientId,
            name: 'Mesures par défaut',
            description: 'Modèle créé automatiquement lors de la migration',
            photoUrls: [],
            status: 'pending',
            deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: oldMeasurement.createdAt || new Date().toISOString(),
            updatedAt: oldMeasurement.updatedAt || new Date().toISOString(),
          };
          models.push(defaultModel);
          modelId = defaultModel.id;
        }

        if (modelId) {
          standardFields.forEach((field) => {
            if (oldMeasurement[field.field] !== undefined && oldMeasurement[field.field] !== null) {
              measurements.push({
                id: `${oldMeasurement.id}_${field.field}`,
                modelId,
                measurementTypeId: typeMap.get(field.field)!,
                value: oldMeasurement[field.field],
                createdAt: oldMeasurement.createdAt || new Date().toISOString(),
                updatedAt: oldMeasurement.updatedAt || new Date().toISOString(),
              });
            }
          });
        }
      });
    }

    return {
      clients: oldData.clients || [],
      models,
      measurementTypes,
      measurements,
      creations: oldData.creations || [],
    };
  }, []);

  const loadData = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        
        if (!parsedData.measurementTypes) {
          console.log('Migrating old data format...');
          const migratedData = migrateOldMeasurements(parsedData);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(migratedData));
          setData(migratedData);
        } else {
          setData(parsedData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [migrateOldMeasurements]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveData = async (newData: AppData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addClient = useCallback((client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newData = { ...data, clients: [...data.clients, newClient] };
    saveData(newData);
  }, [data]);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    const newData = {
      ...data,
      clients: data.clients.map(c => 
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    };
    saveData(newData);
  }, [data]);

  const deleteClient = useCallback((id: string) => {
    const clientModels = data.models.filter(m => m.clientId === id).map(m => m.id);
    const newData = {
      ...data,
      clients: data.clients.filter(c => c.id !== id),
      models: data.models.filter(m => m.clientId !== id),
      measurements: data.measurements.filter(m => !clientModels.includes(m.modelId)),
    };
    saveData(newData);
  }, [data]);

  const addModel = useCallback((model: Omit<Model, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newModel: Model = {
      ...model,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newData = { ...data, models: [...data.models, newModel] };
    saveData(newData);
  }, [data]);

  const updateModel = useCallback((id: string, updates: Partial<Model>) => {
    const newData = {
      ...data,
      models: data.models.map(m => 
        m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
      ),
    };
    saveData(newData);
  }, [data]);

  const deleteModel = useCallback((id: string) => {
    const newData = {
      ...data,
      models: data.models.filter(m => m.id !== id),
      measurements: data.measurements.filter(m => m.modelId !== id),
    };
    saveData(newData);
  }, [data]);

  const addMeasurementType = useCallback((measurementType: Omit<MeasurementType, 'id' | 'createdAt'>) => {
    const newType: MeasurementType = {
      ...measurementType,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const newData = { ...data, measurementTypes: [...data.measurementTypes, newType] };
    saveData(newData);
    return newType;
  }, [data]);

  const addMeasurement = useCallback((measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMeasurement: Measurement = {
      ...measurement,
      id: `${Date.now()}_${Math.random()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newData = { ...data, measurements: [...data.measurements, newMeasurement] };
    saveData(newData);
  }, [data]);

  const deleteMeasurement = useCallback((id: string) => {
    const newData = {
      ...data,
      measurements: data.measurements.filter(m => m.id !== id),
    };
    saveData(newData);
  }, [data]);

  const updateMeasurement = useCallback((id: string, updates: Partial<Measurement>) => {
    const newData = {
      ...data,
      measurements: data.measurements.map(m => 
        m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
      ),
    };
    saveData(newData);
  }, [data]);

  const addCreation = useCallback((creation: Omit<Creation, 'id' | 'createdAt'>) => {
    const newCreation: Creation = {
      ...creation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const newData = { ...data, creations: [...data.creations, newCreation] };
    saveData(newData);
  }, [data]);

  const deleteCreation = useCallback((id: string) => {
    const newData = {
      ...data,
      creations: data.creations.filter(c => c.id !== id),
    };
    saveData(newData);
  }, [data]);

  return {
    data,
    isLoading,
    addClient,
    updateClient,
    deleteClient,
    addModel,
    updateModel,
    deleteModel,
    addMeasurementType,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    addCreation,
    deleteCreation,
  };
});
