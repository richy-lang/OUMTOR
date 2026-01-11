import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Calendar, Image as ImageIcon } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import colors from '@/constants/colors';
import type { ModelStatus } from '@/types';

export default function AddModelScreen() {
  const { clientId } = useLocalSearchParams<{ clientId?: string }>();
  const context = useData() || {};
  const { addModel, data } = context;
  
  const [selectedClientId, setSelectedClientId] = useState<string>(clientId || '');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [status, setStatus] = useState<ModelStatus>('pending');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Info', 'La sélection de photos sera disponible sur mobile');
      return;
    }

    const { status: permissionStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionStatus !== 'granted') {
      Alert.alert('Erreur', 'Permission refusée pour accéder aux photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUrls([...photoUrls, result.assets[0].uri]);
    }
  };

  const handleSubmit = () => {
    if (!selectedClientId || !name.trim() || !deliveryDate) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!addModel) {
      Alert.alert('Erreur', 'Impossible d\'ajouter le modèle. Veuillez réessayer.');
      return;
    }

    addModel({
      clientId: selectedClientId,
      name: name.trim(),
      description: description.trim() || undefined,
      deliveryDate,
      status,
      photoUrls,
    });

    Alert.alert('Succès', 'Modèle ajouté avec succès', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.form}>
        {!clientId && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Client *</Text>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerPlaceholder}>
                {!data || !data.clients || data.clients.length === 0 
                  ? 'Aucun client disponible' 
                  : 'Sélectionnez un client'}
              </Text>
            </View>
            {data?.clients?.map(client => (
              <TouchableOpacity
                key={client.id}
                style={[
                  styles.clientOption,
                  selectedClientId === client.id && styles.clientOptionSelected
                ]}
                onPress={() => setSelectedClientId(client.id)}
              >
                <Text style={[
                  styles.clientOptionText,
                  selectedClientId === client.id && styles.clientOptionTextSelected
                ]}>
                  {client.firstName} {client.lastName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom du modèle *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Robe de soirée"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Détails du modèle..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date de livraison *</Text>
          <View style={styles.dateInputContainer}>
            <Calendar color={colors.primary} size={20} />
            <TextInput
              style={styles.dateInput}
              value={deliveryDate}
              onChangeText={setDeliveryDate}
              placeholder="AAAA-MM-JJ"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Statut</Text>
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[styles.statusButton, status === 'pending' && styles.statusButtonActive]}
              onPress={() => setStatus('pending')}
            >
              <Text style={[styles.statusButtonText, status === 'pending' && styles.statusButtonTextActive]}>
                En attente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, status === 'in_progress' && styles.statusButtonActive]}
              onPress={() => setStatus('in_progress')}
            >
              <Text style={[styles.statusButtonText, status === 'in_progress' && styles.statusButtonTextActive]}>
                En cours
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Photos</Text>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <ImageIcon color={colors.primary} size={24} />
            <Text style={styles.photoButtonText}>Ajouter une photo</Text>
          </TouchableOpacity>
          {photoUrls.length > 0 && (
            <Text style={styles.photoCount}>{photoUrls.length} photo(s) ajoutée(s)</Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Ajouter le Modèle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
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
  form: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  pickerContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerPlaceholder: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  clientOption: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clientOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  clientOptionText: {
    fontSize: 15,
    color: colors.text,
  },
  clientOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  dateInputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  statusButtons: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  statusButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  photoButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed' as const,
  },
  photoButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  photoCount: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
