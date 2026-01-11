import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Phone, MessageCircle, Trash2, Shirt, Star, Crown } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import colors from '@/constants/colors';

export default function ClientDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, deleteClient, updateClient } = useData();

  const client = useMemo(() => data.clients.find(c => c.id === id), [data.clients, id]);
  const clientModels = useMemo(() => data.models.filter(m => m.clientId === id), [data.models, id]);

  if (!client) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Client non trouvé</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le client',
      `Êtes-vous sûr de vouloir supprimer ${client.firstName} ${client.lastName} ? Tous ses modèles et mesures seront également supprimés.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteClient(id);
            router.back();
          },
        },
      ]
    );
  };

  const toggleVip = () => {
    updateClient(id, { isVip: !client.isVip });
  };

  const toggleFavorite = () => {
    updateClient(id, { isFavorite: !client.isFavorite });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>
            {client.firstName[0]}{client.lastName[0]}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{client.firstName} {client.lastName}</Text>
          <Text style={styles.phone}>{client.phone}</Text>
        </View>
        <View style={styles.badges}>
          <TouchableOpacity onPress={toggleFavorite}>
            <Star 
              color={client.isFavorite ? colors.favRed : colors.border} 
              size={24} 
              fill={client.isFavorite ? colors.favRed : 'none'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleVip}>
            <Crown 
              color={client.isVip ? colors.vipGold : colors.border} 
              size={24} 
              fill={client.isVip ? colors.vipGold : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Phone color={colors.primary} size={20} />
          <Text style={styles.actionText}>Appeler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle color={colors.success} size={20} />
          <Text style={styles.actionText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {client.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{client.notes}</Text>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Modèles ({clientModels.length})</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push({ pathname: '/model/add' as any, params: { clientId: id } })}
          >
            <Shirt color={colors.primary} size={20} />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
        {clientModels.length === 0 ? (
          <Text style={styles.emptyText}>Aucun modèle pour ce client</Text>
        ) : (
          clientModels.map(model => (
            <TouchableOpacity
              key={model.id}
              style={styles.modelCard}
              onPress={() => router.push(`/model/${model.id}` as any)}
            >
              <Text style={styles.modelName}>{model.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(model.status) }]}>
                <Text style={styles.statusText}>{getStatusLabel(model.status)}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.dangerZone}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 color={colors.error} size={20} />
          <Text style={styles.deleteButtonText}>Supprimer le client</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    alignItems: 'center' as const,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  initials: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  phone: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  badges: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  actions: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center' as const,
    gap: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  notes: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
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
  modelCard: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  modelName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  dangerZone: {
    marginTop: 16,
  },
  deleteButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.error,
  },
});
