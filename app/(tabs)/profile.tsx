import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, Settings, Info } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User color="#FFFFFF" size={48} />
        </View>
        <Text style={styles.name}>OUMTOR</Text>
        <Text style={styles.subtitle}>Atelier de Couture Professionnel</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mon Atelier</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom de l&apos;atelier</Text>
            <Text style={styles.infoValue}>OUMTOR</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Spécialité</Text>
            <Text style={styles.infoValue}>Couture sur mesure</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Settings color={colors.primary} size={20} />
          <Text style={styles.menuText}>Paramètres généraux</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Info color={colors.info} size={20} />
          <Text style={styles.menuText}>À propos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>OUMTOR © 2024</Text>
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
  header: {
    alignItems: 'center' as const,
    paddingVertical: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  infoLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  menuItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
  },
  footer: {
    alignItems: 'center' as const,
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
