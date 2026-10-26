import { useCallback, useState } from 'react';
import { Animated, RefreshControl, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useStore, selectors } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import RingChart from '@/components/shared/RingChart';
import DeltaChip from '@/components/shared/DeltaChip';
import AllocationChips from '@/components/shared/AllocationChips';
import TransactionRow from '@/components/shared/TransactionRow';
import SectionHeader from '@/components/shared/SectionHeader';
import EmptyState from '@/components/shared/EmptyState';
import ParallaxHeader, { useScrollY } from '@/components/motion/ParallaxHeader';
import CountUp from '@/components/motion/CountUp';
import FadeInView from '@/components/motion/FadeInView';
import PressableScale from '@/components/motion/PressableScale';
import { formatEUR, formatLongToday } from '@/utils/format';

export default function Home() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll } = useScrollY();
  const [refreshing, setRefreshing] = useState(false);

  const user = useAuthStore((s) => s.user);
  const isLoading = useStore((s) => s.isLoading);
  const error = useStore((s) => s.error);
  const refresh = useStore((s) => s.refresh);
  const loadData = useStore((s) => s.loadData);
  const transactions = useStore((s) => s.transactions);
  const budgets = useStore((s) => s.budgets);
  const categories = useStore((s) => s.categories);
  const insights = useStore((s) => s.insights);
  const dismissed = useStore((s) => s.dismissedInsights);
  const dismissInsight = useStore((s) => s.dismissInsight);
  const totalBalance = useStore(selectors.totalBalance);
  const income = useStore(selectors.monthIncome);
  const expenses = useStore(selectors.monthExpenses);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const savingsRate = income > 0 ? Math.max(0, Math.min(1, (income - expenses) / income)) : 0;
  const chips = budgets.map((b) => {
    const cat = categories.find((c) => c.id === b.categoryId);
    return { id: b.id, name: cat?.name ?? 'Autre', icon: cat?.icon ?? 'ellipse-outline', colour: cat?.colour ?? theme.primary, amount: Math.max(0, b.allocatedAmount - b.spentAmount) };
  });
  const visibleInsights = insights.filter((i) => !dismissed.includes(i.id)).slice(0, 2);
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  return (
    <Animated.ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 120, gap: 24 }}
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
    >
      <FadeInView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>M</Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text }}>MY MIB</Text>
          </View>
          <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 4, textTransform: 'capitalize' }}>
            {formatLongToday()} · Bonjour {user?.firstName ?? 'Camille'}
          </Text>
        </View>
        <Avatar uri={user?.avatarUrl} name={`${user?.firstName ?? 'C'} ${user?.lastName ?? 'L'}`} size={44} />
      </FadeInView>

      {error ? (
        <View style={{ marginHorizontal: 20 }}>
          <Card>
            <EmptyState icon="cloud-offline-outline" title="Chargement impossible" description={error} actionLabel="Réessayer" onAction={() => void loadData()} />
          </Card>
        </View>
      ) : null}

      <ParallaxHeader scrollY={scrollY} height={216}>
        <View style={{ paddingHorizontal: 20 }}>
          {isLoading ? (
            <Card>
              <Skeleton width={120} height={14} />
              <View style={{ height: 12 }} />
              <Skeleton width={220} height={44} />
              <View style={{ height: 12 }} />
              <Skeleton width={160} height={14} />
            </Card>
          ) : (
            <Card glass style={{ borderRadius: 28 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, color: theme.textMuted }}>Patrimoine net</Text>
                  <CountUp value={totalBalance} format={(n) => formatEUR(n, true)} style={{ fontSize: 40, fontWeight: '600', color: theme.text, letterSpacing: -1.2, marginTop: 2 }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
                    <DeltaChip value={14.5} />
                    <Text style={{ fontSize: 12, color: theme.textMuted }}>+{formatEUR(income - expenses, true)} ce mois</Text>
                  </View>
                </View>
                <RingChart progress={savingsRate} size={104} stroke={11} label={`${Math.round(savingsRate * 100)}%`} sublabel="épargné" />
              </View>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                <View style={{ flex: 1, padding: 12, borderRadius: 20, backgroundColor: theme.tintGreen }}>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>Revenus</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: theme.success, fontVariant: ['tabular-nums'] }}>{formatEUR(income, true)}</Text>
                </View>
                <View style={{ flex: 1, padding: 12, borderRadius: 20, backgroundColor: theme.tintRed }}>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>Dépenses</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: theme.danger, fontVariant: ['tabular-nums'] }}>{formatEUR(expenses, true)}</Text>
                </View>
              </View>
            </Card>
          )}
        </View>
      </ParallaxHeader>

      <FadeInView delay={150}>
        <View style={{ paddingHorizontal: 20 }}><SectionHeader title="Enveloppes restantes" action="Gérer" onAction={() => router.push('/(tabs)/budget')} /></View>
        <AllocationChips items={chips} onPress={() => router.push('/(tabs)/budget')} />
      </FadeInView>

      {visibleInsights.length > 0 ? (
        <FadeInView delay={220} style={{ paddingHorizontal: 20, gap: 10 }}>
          <SectionHeader title="Conseils" />
          {visibleInsights.map((ins) => (
            <Card key={ins.id} style={{ borderRadius: 24 }}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: theme.tintViolet, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="sparkles" size={17} color={theme.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: theme.text, lineHeight: 20 }}>{ins.message}</Text>
                  <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
                    <Text onPress={() => router.push(ins.type === 'offer' ? '/(tabs)/offers' : '/(tabs)/budget')} style={{ fontSize: 13, fontWeight: '600', color: theme.primary }}>{ins.actionLabel}</Text>
                    <Text onPress={() => dismissInsight(ins.id)} style={{ fontSize: 13, color: theme.textMuted }}>Ignorer</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </FadeInView>
      ) : null}

      <FadeInView delay={280} style={{ paddingHorizontal: 20 }}>
        <SectionHeader title="Activité récente" />
        <Card padded={false} style={{ paddingHorizontal: 16, paddingVertical: 6 }}>
          {isLoading ? (
            <View style={{ gap: 14, paddingVertical: 12 }}>
              <Skeleton height={44} /><Skeleton height={44} /><Skeleton height={44} />
            </View>
          ) : recent.length === 0 ? (
            <EmptyState icon="receipt-outline" title="Aucune transaction" description="Vos opérations apparaîtront ici dès leur importation." />
          ) : (
            recent.map((tx) => <TransactionRow key={tx.id} tx={tx} onPress={() => router.push(`/transaction/${tx.id}`)} />)
          )}
        </Card>
      </FadeInView>

      <FadeInView delay={340} style={{ paddingHorizontal: 20 }}>
        <PressableScale onPress={() => router.push('/goal/goal-1')} scaleTo={0.98}>
          <Card style={{ borderRadius: 28 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="trending-up" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>Prévision de trésorerie · 90 jours</Text>
                <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Aucun solde bas détecté</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </View>
          </Card>
        </PressableScale>
      </FadeInView>
    </Animated.ScrollView>
  );
}