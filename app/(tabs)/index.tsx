import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { UserPlus, Shirt, Image as ImageIcon, TrendingUp, Clock, CheckCircle, Package } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import colors from '@/constants/colors';

export default function Dashboard() {
  // Sécurité : si useData() ou data est undefined, on utilise un fallback
  const context = useData() || {};
  const safeData = context.data || { clients: [], models: [], creations: [] };

  const stats = useMemo(() => {
    const totalClients = safeData.clients.length;
    const vipClients = safeData.clients.filter(c => c.isVip).length;
    const modelsInProgress = safeData.models.filter(m => m.status === 'in_progress').length;
    const modelsDelivered = safeData.models.filter(m => m.status === 'delivered').length;
    const totalCreations = safeData.creations.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveriesToday = safeData.models.filter(m => {
      const deliveryDate = new Date(m.deliveryDate);
      deliveryDate.setHours(0, 0, 0, 0);
      return deliveryDate.getTime() === today.getTime() && m.status !== 'delivered';
    }).length;

    // Correction: check for NaN/undefined stats, and fallback to 0 to avoid undefined object properties.
    return {
      totalClients: typeof totalClients === 'number' ? totalClients : 0,
      vipClients: typeof vipClients === 'number' ? vipClients : 0,
      modelsInProgress: typeof modelsInProgress === 'number' ? modelsInProgress : 0,
      modelsDelivered: typeof modelsDelivered === 'number' ? modelsDelivered : 0,
      totalCreations: typeof totalCreations === 'number' ? totalCreations : 0,
      deliveriesToday: typeof deliveriesToday === 'number' ? deliveriesToday : 0,
    };
  }, [safeData]);

  const recentClients = useMemo(() => {
    return [...safeData.clients]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [safeData.clients]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bienvenue sur OUMTOR</Text>
        <Text style={styles.headerSubtitle}>Gérez votre atelier de couture</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
          <View style={styles.statIconContainer}>
            <TrendingUp color={colors.secondary} size={28} />
          </View>
          <Text style={styles.statValue}>{stats.totalClients}</Text>
          <Text style={styles.statLabel}>Clients Total</Text>
          {stats.vipClients > 0 && (
            <Text style={styles.statSubtext}>dont {stats.vipClients} VIP</Text>
          )}
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.info }]}>
          <View style={styles.statIconContainer}>
            <Clock color="#FFFFFF" size={28} />
          </View>
          <Text style={styles.statValue}>{stats.modelsInProgress}</Text>
          <Text style={styles.statLabel}>En Cours</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.success }]}>
          <View style={styles.statIconContainer}>
            <CheckCircle color="#FFFFFF" size={28} />
          </View>
          <Text style={styles.statValue}>{stats.modelsDelivered}</Text>
          <Text style={styles.statLabel}>Livrés</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.warning }]}>
          <View style={styles.statIconContainer}>
            <Package color="#FFFFFF" size={28} />
          </View>
          <Text style={styles.statValue}>{stats.deliveriesToday}</Text>
          <Text style={styles.statLabel}>À Livrer Aujourd&apos;hui</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/client/add')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
              <UserPlus color="#FFFFFF" size={32} />
            </View>
            <Text style={styles.actionText}>Nouveau Client</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/model/add')}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.info }]}>
              <Shirt color="#FFFFFF" size={32} />
            </View>
            <Text style={styles.actionText}>Nouveau Modèle</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/creation/add' as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.success }]}>
              <ImageIcon color="#FFFFFF" size={32} />
            </View>
            <Text style={styles.actionText}>Nouvelle Création</Text>
          </TouchableOpacity>
        </View>
      </View>

      {recentClients.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clients Récents</Text>
          {recentClients.map(client => (
            <TouchableOpacity
              key={client.id}
              style={styles.clientCard}
              onPress={() => router.push(`/client/${client.id}`)}
            >
              <View style={styles.clientAvatar}>
                <Text style={styles.clientInitials}>
                  {client.firstName[0]}{client.lastName[0]}
                </Text>
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>
                  {client.firstName} {client.lastName}
                </Text>
                <Text style={styles.clientPhone}>{client.phone}</Text>
              </View>
              {client.isVip && (
                <View style={styles.vipBadge}>
                  <Text style={styles.vipText}>VIP</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/clients')}
          >
            <Text style={styles.viewAllText}>Voir tous les clients</Text>
          </TouchableOpacity>
        </View>
      )}

      {safeData.clients.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Commencez dès maintenant</Text>
          <Text style={styles.emptyText}>
            Ajoutez votre premier client pour gérer vos modèles et mesures
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ... Styles inchangés

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#FFFFFF',
    textAlign: 'center' as const,
    opacity: 0.9,
  },
  statSubtext: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center' as const,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center' as const,
  },
  clientCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  clientInitials: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  vipBadge: {
    backgroundColor: colors.vipGold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vipText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  viewAllButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center' as const,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: 48,
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
    paddingHorizontal: 32,
  },
});
