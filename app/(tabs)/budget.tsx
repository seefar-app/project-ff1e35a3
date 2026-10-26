import { useState } from 'react';
import { ScrollView, Text, View, LayoutAnimation, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/shared/SectionHeader';
import EmptyState from '@/components/shared/EmptyState';
import RingChart from '@/components/shared/RingChart';
import FadeInView from '@/components/motion/FadeInView';
import PressableScale from '@/components/motion/PressableScale';
import { formatEUR, formatShortDate } from '@/utils/format';

const TABS = ['Enveloppes', 'Analyse', 'Objectifs', 'Abonnements'] as const;

export default function BudgetScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Enveloppes');
  const budgets = useStore((s) => s.budgets);
  const categories = useStore((s) => s.categories);
  const goals = useStore((s) => s.goals);
  const subscriptions = useStore((s) => s.subscriptions);
  const transactions = useStore((s) => s.transactions);
  const addBudget = useStore((s) => s.addBudget);
  const setBudgetAmount = useStore((s) => s.setBudgetAmount);
  const cancelSubscription = useStore((s) => s.cancelSubscription);

  const totalAllocated = budgets.reduce((s, b) => s + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spentAmount, 0);

  const changeTab = (t: (typeof TABS)[number]) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTab(t);
  };

  const unbudgeted = categories.filter((c) => c.id !== 'cat-revenus' && !budgets.some((b) => b.categoryId === c.id));

  const byCategory = categories
    .filter((c) => c.id !== 'cat-revenus')
    .map((c) => ({ c, total: transactions.filter((t) => t.type === 'expense' && t.categoryId === c.id).reduce((s, t) => s + t.amount, 0) }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);
  const maxCat = byCategory[0]?.total ?? 1;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 120, paddingHorizontal: 20, gap: 20 }} showsVerticalScrollIndicator={false}>
      <FadeInView>
        <Text style={{ fontSize: 34, fontWeight: '700', color: theme.text, letterSpacing: -1 }}>Budget</Text>
        <Text style={{ fontSize: 14, color: theme.textMuted, marginTop: 2 }}>Janvier 2025</Text>
      </FadeInView>

      <FadeInView delay={80}>
        <Card glass>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 13, color: theme.textMuted }}>Dépensé ce mois</Text>
              <Text style={{ fontSize: 34, fontWeight: '600', color: theme.text, letterSpacing: -1, fontVariant: ['tabular-nums'], marginTop: 2 }}>{formatEUR(totalSpent, true)}</Text>
              <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>sur {formatEUR(totalAllocated, true)} alloués</Text>
            </View>
            <RingChart progress={totalAllocated ? totalSpent / totalAllocated : 0} size={96} stroke={10} label={`${Math.round(totalAllocated ? (totalSpent / totalAllocated) * 100 : 0)}%`} />
          </View>
        </Card>
      </FadeInView>

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <PressableScale key={t} onPress={() => changeTab(t)} scaleTo={0.95}>
              <View style={{ paddingHorizontal: 16, height: 40, justifyContent: 'center', borderRadius: 999, backgroundColor: active ? theme.text : theme.card, borderWidth: 0.5, borderColor: theme.cardBorder }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: active ? theme.background : theme.textBody }}>{t}</Text>
              </View>
            </PressableScale>
          );
        })}
      </View>

      {tab === 'Enveloppes' && (
        <FadeInView style={{ gap: 12 }}>
          {budgets.length === 0 ? (
            <Card><EmptyState icon="pie-chart-outline" title="Aucune enveloppe" description="Créez votre première enveloppe pour suivre vos dépenses." /></Card>
          ) : null}
          {budgets.map((b) => {
            const cat = categories.find((c) => c.id === b.categoryId);
            const pct = b.allocatedAmount ? b.spentAmount / b.allocatedAmount : 0;
            const status = pct >= 1 ? 'exceeded' : pct >= 0.75 ? 'warning' : 'on_track';
            const barColor = status === 'exceeded' ? theme.danger : status === 'warning' ? theme.warning : theme.accent;
            return (
              <Card key={b.id} style={{ borderRadius: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: (cat?.colour ?? theme.primary) + '22', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={(cat?.icon ?? 'ellipse-outline') as keyof typeof Ionicons.glyphMap} size={19} color={cat?.colour ?? theme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>{cat?.name}</Text>
                    <Text style={{ fontSize: 12, color: theme.textMuted, fontVariant: ['tabular-nums'] }}>{formatEUR(b.spentAmount)} / {formatEUR(b.allocatedAmount, true)}</Text>
                  </View>
                  <Badge label={status === 'exceeded' ? 'Dépassé' : status === 'warning' ? 'Attention' : 'Dans les clous'} tone={status === 'exceeded' ? 'danger' : status === 'warning' ? 'warning' : 'success'} />
                </View>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.hairline, marginTop: 14, overflow: 'hidden' }}>
                  <View style={{ height: 8, width: `${Math.min(100, pct * 100)}%`, backgroundColor: barColor, borderRadius: 4 }} />
                </View>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                  <Button title="−20 €" variant="ghost" small onPress={() => void setBudgetAmount(b.id, Math.max(20, b.allocatedAmount - 20))} />
                  <Button title="+20 €" variant="tinted" small onPress={() => void setBudgetAmount(b.id, b.allocatedAmount + 20)} />
                </View>
              </Card>
            );
          })}
          {unbudgeted.length > 0 ? (
            <Button title={`Ajouter l'enveloppe ${unbudgeted[0].name}`} variant="tinted" icon="add" onPress={() => void addBudget(unbudgeted[0].id, 100)} />
          ) : null}
        </FadeInView>
      )}

      {tab === 'Analyse' && (
        <FadeInView style={{ gap: 12 }}>
          <SectionHeader title="Dépenses par catégorie" />
          <Card>
            <View style={{ gap: 16 }}>
              {byCategory.map(({ c, total }) => (
                <View key={c.id} style={{ gap: 6 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, color: theme.text, fontWeight: '500' }}>{c.name}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, fontVariant: ['tabular-nums'] }}>{formatEUR(total)}</Text>
                  </View>
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.hairline, overflow: 'hidden' }}>
                    <View style={{ height: 8, width: `${(total / maxCat) * 100}%`, backgroundColor: c.colour, borderRadius: 4 }} />
                  </View>
                </View>
              ))}
            </View>
          </Card>
          <Card>
            <Text style={{ fontSize: 13, color: theme.textMuted }}>Top commerçants</Text>
            {[...transactions].filter((t) => t.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 3).map((t) => (
              <View key={t.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                <Text style={{ fontSize: 14, color: theme.text }}>{t.merchant}</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, fontVariant: ['tabular-nums'] }}>{formatEUR(t.amount)}</Text>
              </View>
            ))}
          </Card>
        </FadeInView>
      )}

      {tab === 'Objectifs' && (
        <FadeInView style={{ gap: 12 }}>
          {goals.map((g) => {
            const p = g.targetAmount ? g.currentAmount / g.targetAmount : 0;
            return (
              <Card key={g.id} onPress={() => router.push(`/goal/${g.id}`)} style={{ borderRadius: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <RingChart progress={p} size={64} stroke={8} label={`${Math.round(p * 100)}%`} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>{g.name}</Text>
                    <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2, fontVariant: ['tabular-nums'] }}>{formatEUR(g.currentAmount, true)} sur {formatEUR(g.targetAmount, true)}</Text>
                    <View style={{ marginTop: 6 }}><Badge label={g.status === 'atteint' ? 'Atteint' : 'En cours'} tone={g.status === 'atteint' ? 'success' : 'info'} /></View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                </View>
              </Card>
            );
          })}
        </FadeInView>
      )}

      {tab === 'Abonnements' && (
        <FadeInView style={{ gap: 12 }}>
          {subscriptions.map((s) => (
            <Card key={s.id} style={{ borderRadius: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.tintViolet, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="repeat" size={18} color={theme.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>{s.merchant}</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>Prochain prélèvement le {formatShortDate(s.nextChargeDate)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text, fontVariant: ['tabular-nums'] }}>{formatEUR(s.amount)}</Text>
                  <Badge label={s.status === 'flagged' ? 'Peu utilisé' : s.status === 'cancelled' ? 'Résilié' : 'Actif'} tone={s.status === 'flagged' ? 'warning' : s.status === 'cancelled' ? 'neutral' : 'success'} />
                </View>
              </View>
              {s.status === 'flagged' ? (
                <View style={{ marginTop: 12 }}>
                  <Button title="Marquer comme résilié" variant="destructive" small onPress={() => Alert.alert('Résilier ?', `Nous vous rappellerons de résilier ${s.merchant}.`, [{ text: 'Annuler', style: 'cancel' }, { text: 'Confirmer', onPress: () => void cancelSubscription(s.id) }])} />
                </View>
              ) : null}
            </Card>
          ))}
        </FadeInView>
      )}
    </ScrollView>
  );
}