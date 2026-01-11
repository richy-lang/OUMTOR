import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Ruler, Plus, Trash2, Edit2, X, Check } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import colors from '@/constants/colors';

export default function ModelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, deleteModel, addMeasurementType, addMeasurement, updateMeasurement, deleteMeasurement } = useData();

  const [isAddingMeasurement, setIsAddingMeasurement] = useState<boolean>(false);
  const [newMeasurementName, setNewMeasurementName] = useState<string>('');
  const [newMeasurementUnit, setNewMeasurementUnit] = useState<string>('cm');
  const [newMeasurementValue, setNewMeasurementValue] = useState<string>('');
  const [editingMeasurementId, setEditingMeasurementId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const model = useMemo(() => data.models.find(m => m.id === id), [data.models, id]);
  const client = useMemo(() => {
    if (!model) return null;
    return data.clients.find(c => c.id === model.clientId);
  }, [data.clients, model]);

  const modelMeasurements = useMemo(() => {
    return data.measurements
      .filter(m => m.modelId === id)
      .map(measurement => {
        const type = data.measurementTypes.find(t => t.id === measurement.measurementTypeId);
        return { ...measurement, type };
      })
      .filter(m => m.type);
  }, [data.measurements, data.measurementTypes, id]);

  if (!model || !client) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Modèle non trouvé</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le modèle',
      `Êtes-vous sûr de vouloir supprimer "${model.name}" ? Toutes les mesures seront également supprimées.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteModel(id);
            router.back();
          },
        },
      ]
    );
  };

  const handleAddMeasurement = () => {
    if (!newMeasurementName.trim() || !newMeasurementValue.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const value = parseFloat(newMeasurementValue);
    if (isNaN(value)) {
      Alert.alert('Erreur', 'La valeur doit être un nombre');
      return;
    }

    let measurementType = data.measurementTypes.find(
      t => t.name.toLowerCase() === newMeasurementName.trim().toLowerCase()
    );

    if (!measurementType) {
      measurementType = addMeasurementType({
        name: newMeasurementName.trim(),
        unit: newMeasurementUnit.trim(),
      });
    }

    addMeasurement({
      modelId: id,
      measurementTypeId: measurementType.id,
      value,
    });

    setNewMeasurementName('');
    setNewMeasurementUnit('cm');
    setNewMeasurementValue('');
    setIsAddingMeasurement(false);
  };

  const handleEditMeasurement = (measurementId: string) => {
    const measurement = data.measurements.find(m => m.id === measurementId);
    if (measurement) {
      setEditingMeasurementId(measurementId);
      setEditingValue(measurement.value.toString());
    }
  };

  const handleSaveEdit = () => {
    if (!editingMeasurementId) return;

    const value = parseFloat(editingValue);
    if (isNaN(value)) {
      Alert.alert('Erreur', 'La valeur doit être un nombre');
      return;
    }

    updateMeasurement(editingMeasurementId, { value });
    setEditingMeasurementId(null);
    setEditingValue('');
  };

  const handleDeleteMeasurement = (measurementId: string) => {
    Alert.alert(
      'Supprimer la mesure',
      'Êtes-vous sûr de vouloir supprimer cette mesure ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteMeasurement(measurementId),
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: model.name,
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 color={colors.error} size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.clientName}>{client.firstName} {client.lastName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(model.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(model.status)}</Text>
          </View>
        </View>

        {model.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{model.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date de livraison</Text>
          <Text style={styles.deliveryDate}>{model.deliveryDate}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ruler color={colors.primary} size={20} />
              <Text style={styles.sectionTitle}>Mesures ({modelMeasurements.length})</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAddingMeasurement(true)}
            >
              <Plus color={colors.primary} size={20} />
              <Text style={styles.addButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>

          {isAddingMeasurement && (
            <View style={styles.addMeasurementForm}>
              <View style={styles.formRow}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  value={newMeasurementName}
                  onChangeText={setNewMeasurementName}
                  placeholder="Nom de la mesure"
                  placeholderTextColor={colors.textSecondary}
                />
                <TextInput
                  style={styles.inputSmall}
                  value={newMeasurementUnit}
                  onChangeText={setNewMeasurementUnit}
                  placeholder="Unité"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={styles.formRow}>
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  value={newMeasurementValue}
                  onChangeText={setNewMeasurementValue}
                  placeholder="Valeur"
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.textSecondary}
                />
                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.iconButtonSuccess]}
                    onPress={handleAddMeasurement}
                  >
                    <Check color="#FFFFFF" size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.iconButtonError]}
                    onPress={() => {
                      setIsAddingMeasurement(false);
                      setNewMeasurementName('');
                      setNewMeasurementUnit('cm');
                      setNewMeasurementValue('');
                    }}
                  >
                    <X color="#FFFFFF" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {modelMeasurements.length === 0 && !isAddingMeasurement ? (
            <Text style={styles.emptyText}>Aucune mesure pour ce modèle</Text>
          ) : (
            <View style={styles.measurementsList}>
              {modelMeasurements.map(measurement => (
                <View key={measurement.id} style={styles.measurementCard}>
                  <View style={styles.measurementInfo}>
                    <Text style={styles.measurementName}>{measurement.type?.name}</Text>
                    {editingMeasurementId === measurement.id ? (
                      <View style={styles.editRow}>
                        <TextInput
                          style={styles.editInput}
                          value={editingValue}
                          onChangeText={setEditingValue}
                          keyboardType="decimal-pad"
                          autoFocus
                        />
                        <Text style={styles.measurementUnit}>{measurement.type?.unit}</Text>
                      </View>
                    ) : (
                      <Text style={styles.measurementValue}>
                        {measurement.value} {measurement.type?.unit}
                      </Text>
                    )}
                  </View>
                  <View style={styles.measurementActions}>
                    {editingMeasurementId === measurement.id ? (
                      <>
                        <TouchableOpacity
                          style={[styles.iconButton, styles.iconButtonSuccess]}
                          onPress={handleSaveEdit}
                        >
                          <Check color="#FFFFFF" size={18} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.iconButton, styles.iconButtonError]}
                          onPress={() => {
                            setEditingMeasurementId(null);
                            setEditingValue('');
                          }}
                        >
                          <X color="#FFFFFF" size={18} />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={() => handleEditMeasurement(measurement.id)}
                        >
                          <Edit2 color={colors.info} size={18} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={() => handleDeleteMeasurement(measurement.id)}
                        >
                          <Trash2 color={colors.error} size={18} />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return colors.statusPending;
    case 'in_progress': return colors.statusInProgress;
    case 'delivered': return colors.statusDelivered;
    case 'cancelled': return colors.statusCancelled;
    default: return colors.border;
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending': return 'En attente';
    case 'in_progress': return 'En cours';
    case 'delivered': return 'Livré';
    case 'cancelled': return 'Annulé';
    default: return status;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  deliveryDate: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  addButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  addMeasurementForm: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  formRow: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputFlex: {
    flex: 1,
  },
  inputSmall: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    width: 70,
  },
  formActions: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.surface,
  },
  iconButtonSuccess: {
    backgroundColor: colors.success,
  },
  iconButtonError: {
    backgroundColor: colors.error,
  },
  measurementsList: {
    gap: 8,
  },
  measurementCard: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  measurementInfo: {
    flex: 1,
  },
  measurementName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 16,
    color: colors.primary,
  },
  measurementActions: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  editRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  editInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.primary,
    width: 80,
  },
  measurementUnit: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
