import { Alert, ScrollView, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/shared/SectionHeader';
import FadeInView from '@/components/motion/FadeInView';
import { formatEUR, formatShortDate } from '@/utils/format';

function Row({ icon, label, value, right }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; right?: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 56, gap: 14, paddingVertical: 8 }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={17} color={theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, color: theme.text, fontWeight: '500' }}>{label}</Text>
        {value ? <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{value}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export default function Profile() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const profile = useStore((s) => s.profile);
  const accounts = useStore((s) => s.accounts);
  const prefs = useStore((s) => s.notificationPrefs);
  const toggle = useStore((s) => s.toggleNotification);
  const setPlan = useStore((s) => s.setPlan);

  const onLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const onDelete = () => {
    Alert.alert('Supprimer le compte', 'Toutes vos données seront supprimées sous 30 jours conformément au RGPD. Cette action est irréversible.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => void onLogout() },
    ]);
  };

  const onExport = () => {
    Alert.alert('Exporter mes données', 'Choisissez un format pour la période en cours.', [
      { text: 'CSV', onPress: () => Alert.alert('Export prêt', 'Votre fichier CSV a été généré.') },
      { text: 'PDF', onPress: () => Alert.alert('Export prêt', 'Votre rapport PDF a été généré.') },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const notifRows: { key: keyof typeof prefs; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'budget', label: 'Alertes de budget', icon: 'pie-chart-outline' },
    { key: 'bills', label: 'Factures à venir', icon: 'receipt-outline' },
    { key: 'offers', label: 'Nouvelles offres', icon: 'gift-outline' },
    { key: 'security', label: 'Sécurité', icon: 'shield-outline' },
    { key: 'summary', label: 'Résumé hebdomadaire', icon: 'mail-outline' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 120, paddingHorizontal: 20, gap: 22 }} showsVerticalScrollIndicator={false}>
      <FadeInView style={{ alignItems: 'center', gap: 8 }}>
        <Avatar uri={user?.avatarUrl} name={`${user?.firstName ?? 'C'} ${user?.lastName ?? 'L'}`} size={88} />
        <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text, letterSpacing: -0.5 }}>{user?.firstName} {user?.lastName}</Text>
        <Text style={{ fontSize: 14, color: theme.textMuted }}>{user?.email}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Badge label={user?.profileType === 'entreprise' ? 'Entreprise' : user?.profileType === 'professionnel' ? 'Professionnel' : 'Particulier'} tone="info" />
          <Badge label={profile.plan === 'plus' ? 'MY MIB Plus' : 'Gratuit'} tone={profile.plan === 'plus' ? 'violet' : 'neutral'} />
        </View>
      </FadeInView>

      {profile.plan === 'free' ? (
        <FadeInView delay={80}>
          <Card glass>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.tintViolet, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="diamond-outline" size={22} color={theme.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>MY MIB Plus</Text>
                <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Prévisions illimitées, export PDF, mode entreprise · 4,99 €/mois</Text>
              </View>
            </View>
            <View style={{ marginTop: 14 }}><Button title="Passer à Plus" onPress={() => void setPlan('plus')} variant="dark" /></View>
          </Card>
        </FadeInView>
      ) : null}

      <FadeInView delay={140}>
        <SectionHeader title="Comptes connectés" />
        <Card padded={false} style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
          {accounts.map((a) => (
            <Row key={a.id} icon={a.type === 'epargne' ? 'wallet-outline' : a.type === 'professionnel' ? 'briefcase-outline' : a.type === 'especes' ? 'cash-outline' : 'card-outline'} label={a.name} value={`${a.institution} · sync ${formatShortDate(a.lastSyncedAt)}`} right={<Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, fontVariant: ['tabular-nums'] }}>{formatEUR(a.balance, true)}</Text>} />
          ))}
        </Card>
      </FadeInView>

      <FadeInView delay={200}>
        <SectionHeader title="Notifications" />
        <Card padded={false} style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
          {notifRows.map((n) => (
            <Row key={n.key} icon={n.icon} label={n.label} right={<Switch value={prefs[n.key]} onValueChange={() => void toggle(n.key)} trackColor={{ true: theme.primary, false: theme.hairline }} />} />
          ))}
        </Card>
      </FadeInView>

      <FadeInView delay={260}>
        <SectionHeader title="Sécurité et confidentialité" />
        <Card padded={false} style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
          <Row icon="finger-print" label="Déverrouillage biométrique" value={user?.biometricEnabled ? 'Activé' : 'Désactivé'} right={<Badge label={user?.biometricEnabled ? 'Actif' : 'Inactif'} tone={user?.biometricEnabled ? 'success' : 'neutral'} />} />
          <Row icon="shield-checkmark-outline" label="Authentification à deux facteurs" value="Application d'authentification" right={<Badge label={user?.twoFactorEnabled ? 'Actif' : 'Inactif'} tone={user?.twoFactorEnabled ? 'success' : 'neutral'} />} />
          <Row icon="business-outline" label="Entreprise" value={`${profile.companyName} · SIRET ${profile.siret}`} />
          <Row icon="download-outline" label="Exporter mes données (CSV / PDF)" right={<Ionicons name="chevron-forward" size={18} color={theme.textMuted} />} />
        </Card>
        <View style={{ gap: 10, marginTop: 12 }}>
          <Button title="Exporter mes données" variant="tinted" icon="download-outline" onPress={onExport} />
          <Button title="Supprimer mon compte" variant="destructive" onPress={onDelete} />
        </View>
      </FadeInView>

      <FadeInView delay={320}>
        <Button title="Se déconnecter" variant="dark" icon="log-out-outline" onPress={onLogout} />
        <Text style={{ textAlign: 'center', fontSize: 11, color: theme.textMuted, marginTop: 14 }}>MY MIB · version 1.0.0 · Données chiffrées de bout en bout</Text>
      </FadeInView>
    </ScrollView>
  );
}