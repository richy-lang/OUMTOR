import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Search, UserPlus, Star, Crown } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import colors from '@/constants/colors';
import type { Client } from '@/types';

export default function ClientsScreen() {
  const { data } = useData();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredClients = useMemo(() => {
    if (!data || !data.clients) return [];
    const query = searchQuery.toLowerCase();
    return data.clients.filter(client => 
      client.firstName.toLowerCase().includes(query) ||
      client.lastName.toLowerCase().includes(query) ||
      client.phone.includes(query)
    ).sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
      if (a.isVip !== b.isVip) return a.isVip ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [data, searchQuery]);

  const renderClient = ({ item }: { item: Client }) => {
    const clientModels = (data?.models || []).filter(m => m.clientId === item.id);
    const modelsInProgress = clientModels.filter(m => m.status === 'in_progress').length;
    const modelsDelivered = clientModels.filter(m => m.status === 'delivered').length;

    return (
      <TouchableOpacity
        style={styles.clientCard}
        onPress={() => router.push(`/client/${item.id}`)}
      >
        <View style={styles.clientHeader}>
          <View style={styles.clientAvatar}>
            <Text style={styles.clientInitials}>
              {item.firstName[0]}{item.lastName[0]}
            </Text>
          </View>
          <View style={styles.clientInfo}>
            <View style={styles.clientNameRow}>
              <Text style={styles.clientName}>
                {item.firstName} {item.lastName}
              </Text>
              {item.isFavorite && (
                <Star color={colors.favRed} size={16} fill={colors.favRed} />
              )}
              {item.isVip && (
                <Crown color={colors.vipGold} size={16} fill={colors.vipGold} />
              )}
            </View>
            <Text style={styles.clientPhone}>{item.phone}</Text>
          </View>
        </View>
        
        <View style={styles.clientStats}>
          <View style={styles.statBadge}>
            <Text style={styles.statValue}>{modelsInProgress}</Text>
            <Text style={styles.statText}>En cours</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statValue}>{modelsDelivered}</Text>
            <Text style={styles.statText}>Livrés</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color={colors.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par nom ou téléphone..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <FlatList
        data={filteredClients}
        renderItem={renderClient}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Aucun client trouvé' : 'Aucun client'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Essayez une autre recherche' 
                : 'Ajoutez votre premier client pour commencer'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/client/add')}
      >
        <UserPlus color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  searchContainer: {
    backgroundColor: colors.background,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  clientCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  clientHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  clientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  clientInitials: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  clientInfo: {
    flex: 1,
  },
  clientNameRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  clientPhone: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  clientStats: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  statBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  statText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center' as const,
  },
  fab: {
    position: 'absolute' as const,
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
