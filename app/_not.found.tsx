import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AlertCircle } from "lucide-react-native";
import colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: "Page introuvable",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.background,
        }} 
      />
      <View style={styles.container}>
        <AlertCircle color={colors.primary} size={64} />
        <Text style={styles.title}>Page introuvable</Text>
        <Text style={styles.description}>
          Cette page n&apos;existe pas ou a été déplacée.
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Retour à l&apos;accueil</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 20,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center" as const,
    marginBottom: 24,
  },
  link: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
