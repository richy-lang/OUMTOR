import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { useData } from '@/contexts/DataContext';
import colors from '@/constants/colors';

export default function AddClientScreen() {
  const { addClient, data } = useData();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isVip, setIsVip] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const phoneExists = data.clients.some(c => c.phone === phone);
    if (phoneExists) {
      Alert.alert('Erreur', 'Un client avec ce numéro de téléphone existe déjà');
      return;
    }

    addClient({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      isVip,
      isFavorite,
      notes: notes.trim() || undefined,
    });

    Alert.alert('Succès', 'Client ajouté avec succès', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Prénom *</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Entrez le prénom"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom *</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Entrez le nom"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Téléphone *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+221 XX XXX XX XX"
            keyboardType="phone-pad"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes privées sur le client..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.switchGroup}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Client VIP</Text>
            <Switch
              value={isVip}
              onValueChange={setIsVip}
              trackColor={{ false: colors.border, true: colors.vipGold }}
              thumbColor={isVip ? colors.primary : colors.surface}
            />
          </View>
          <Text style={styles.switchDescription}>
            Les clients VIP apparaissent en haut de la liste
          </Text>
        </View>

        <View style={styles.switchGroup}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Client Favori</Text>
            <Switch
              value={isFavorite}
              onValueChange={setIsFavorite}
              trackColor={{ false: colors.border, true: colors.favRed }}
              thumbColor={isFavorite ? colors.primary : colors.surface}
            />
          </View>
          <Text style={styles.switchDescription}>
            Marquez vos clients préférés
          </Text>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Ajouter le Client</Text>
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
  switchGroup: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  switchRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  switchDescription: {
    fontSize: 13,
    color: colors.textSecondary,
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
