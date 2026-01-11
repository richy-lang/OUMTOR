import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image as RNImage } from 'react-native';
import { router } from 'expo-router';
import { Plus, ImageIcon } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import colors from '@/constants/colors';
import type { Creation } from '@/types';

export default function CreationsScreen() {
  const { data } = useData();

  const renderCreation = ({ item }: { item: Creation }) => (
    <TouchableOpacity style={styles.creationCard}>
      {item.photoUrls[0] ? (
        <RNImage source={{ uri: item.photoUrls[0] }} style={styles.creationImage} />
      ) : (
        <View style={[styles.creationImage, styles.placeholderImage]}>
          <ImageIcon color={colors.textSecondary} size={40} />
        </View>
      )}
      <View style={styles.creationInfo}>
        <Text style={styles.creationName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.creationDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {item.tags.length > 0 && (
          <View style={styles.tags}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data.creations}
        renderItem={renderCreation}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ImageIcon color={colors.textSecondary} size={64} />
            <Text style={styles.emptyTitle}>Aucune création</Text>
            <Text style={styles.emptyText}>
              Partagez vos créations personnelles pour construire votre portfolio
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/creation/add' as any)}
      >
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContent: {
    padding: 8,
    paddingBottom: 100,
  },
  columnWrapper: {
    gap: 8,
  },
  creationCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: 'hidden' as const,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  creationImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
  },
  placeholderImage: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  creationInfo: {
    padding: 12,
  },
  creationName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  creationDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 4,
  },
  tag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600' as const,
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
    marginTop: 16,
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
