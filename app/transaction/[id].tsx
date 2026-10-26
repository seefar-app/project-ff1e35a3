import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/shared/EmptyState';
import FadeInView from '@/components/motion/FadeInView';
import PressableScale from '@/components/motion/PressableScale';
import { formatDate, formatEUR } from '@/utils/format';

export default function TransactionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tx = useStore((s) => s.transactions.find((t) => t.id === id));
  const categories = useStore((s) => s.categories);
  const accounts = useStore((s) => s.accounts);
  const updateCategory = useStore((s) => s.updateTransactionCategory);

  if (!tx) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top + 20 }}>
        <EmptyState icon="alert-circle-outline" title="Transaction introuvable" description="Cette opération n'existe plus ou a été supprimée." actionLabel="Retour" onAction={() => router.back()} />
      </View>
    );
  }

  const category = categories.find((c) => c.id === tx.categoryId);
  const account = accounts.find((a) => a.id === tx.accountId);
  const income = tx.type === 'income';
  const statusLabel = { pending: 'En attente', cleared: 'Validée', categorized: 'Catégorisée', flagged: 'À vérifier' }[tx.status];
  const statusTone = tx.status === 'flagged' ? 'warning' : tx.status === 'pending' ? 'neutral' : 'success';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40, paddingHorizontal: 20, gap: 20 }} showsVerticalScrollIndicator={false}>
      <PressableScale onPress={() => router.back()} style={{ alignSelf: 'flex-start' }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: theme.cardBorder }}>
          <Ionicons name="chevron-back" size={22} color={theme.text} />
        </View>
      </PressableScale>

      <FadeInView style={{ alignItems: 'center', gap: 6 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: (category?.colour ?? theme.primary) + '22', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={(category?.icon ?? 'cash-outline') as keyof typeof Ionicons.glyphMap} size={28} color={category?.colour ?? theme.primary} />
        </View>
        <Text style={{ fontSize: 16, color: theme.textBody, marginTop: 6 }}>{tx.merchant}</Text>
        <Text style={{ fontSize: 48, fontWeight: '600', letterSpacing: -1.5, color: income ? theme.success : theme.text, fontVariant: ['tabular-nums'] }}>
          {income ? '+' : '−'}{formatEUR(tx.amount)}
        </Text>
        <Badge label={statusLabel} tone={statusTone} />
      </FadeInView>

      <FadeInView delay={100}>
        <Card padded={false} style={{ paddingHorizontal: 18, paddingVertical: 6 }}>
          {[
            { k: 'Date', v: formatDate(tx.date) },
            { k: 'Catégorie', v: category?.name ?? 'Autre' },
            { k: 'Compte', v: account?.name ?? '—' },
            { k: 'Récurrente', v: tx.isRecurring ? 'Oui' : 'Non' },
            { k: 'Notes', v: tx.notes || '—' },
          ].map((row, i, arr) => (
            <View key={row.k} style={{ flexDirection: 'row', justifyContent: 'space-between', minHeight: 52, alignItems: 'center', borderBottomWidth: i === arr.length - 1 ? 0 : 0.5, borderBottomColor: theme.hairline }}>
              <Text style={{ fontSize: 14, color: theme.textMuted }}>{row.k}</Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: theme.text, maxWidth: '60%', textAlign: 'right' }}>{row.v}</Text>
            </View>
          ))}
        </Card>
      </FadeInView>

      {!income ? (
        <FadeInView delay={160} style={{ gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>Changer de catégorie</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {categories.filter((c) => c.id !== 'cat-revenus').map((c) => {
              const active = c.id === tx.categoryId;
              return (
                <PressableScale key={c.id} onPress={() => void updateCategory(tx.id, c.id)} haptic scaleTo={0.95}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 40, paddingHorizontal: 14, borderRadius: 999, backgroundColor: active ? c.colour : theme.card, borderWidth: 0.5, borderColor: theme.cardBorder }}>
                    <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={15} color={active ? '#fff' : c.colour} />
                    <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#fff' : theme.textBody }}>{c.name}</Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </FadeInView>
      ) : null}

      <FadeInView delay={220} style={{ gap: 10 }}>
        <Button title="Joindre un reçu" variant="tinted" icon="camera-outline" onPress={() => {}} />
        <Button title="Fermer" variant="ghost" onPress={() => router.back()} />
      </FadeInView>
    </ScrollView>
  );
}