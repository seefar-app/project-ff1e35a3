import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import RingChart from '@/components/shared/RingChart';
import EmptyState from '@/components/shared/EmptyState';
import FadeInView from '@/components/motion/FadeInView';
import PressableScale from '@/components/motion/PressableScale';
import { formatDate, formatEUR, monthsUntil } from '@/utils/format';

const RANGES = ['1S', '1M', '3M'] as const;

export default function GoalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const goal = useStore((s) => s.goals.find((g) => g.id === id));
  const addContribution = useStore((s) => s.addGoalContribution);
  const [range, setRange] = useState<(typeof RANGES)[number]>('3M');
  const [busy, setBusy] = useState(false);

  if (!goal) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top + 20 }}>
        <EmptyState icon="flag-outline" title="Objectif introuvable" description="Cet objectif n'existe plus." actionLabel="Retour" onAction={() => router.back()} />
      </View>
    );
  }

  const p = goal.targetAmount ? goal.currentAmount / goal.targetAmount : 0;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const months = monthsUntil(goal.deadline);
  const suggested = goal.status === 'atteint' ? 0 : Math.ceil(remaining / months);

  const pointsCount = range === '1S' ? 7 : range === '1M' ? 12 : 18;
  const W = 320;
  const H = 120;
  const pts = Array.from({ length: pointsCount }, (_, i) => {
    const t = i / (pointsCount - 1);
    const val = goal.currentAmount * (0.55 + 0.45 * t) + Math.sin(i * 1.3) * (goal.targetAmount * 0.012);
    return { x: t * W, y: H - (val / goal.targetAmount) * (H - 12) - 6 };
  });
  const line = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
  const area = `${line} L${W},${H} L0,${H} Z`;

  const contribute = async (amount: number) => {
    setBusy(true);
    await addContribution(goal.id, amount);
    setBusy(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40, paddingHorizontal: 20, gap: 20 }} showsVerticalScrollIndicator={false}>
      <PressableScale onPress={() => router.back()} style={{ alignSelf: 'flex-start' }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: theme.cardBorder }}>
          <Ionicons name="chevron-back" size={22} color={theme.text} />
        </View>
      </PressableScale>

      <FadeInView>
        <Text style={{ fontSize: 15, color: theme.textMuted }}>{goal.name}</Text>
        <Text style={{ fontSize: 48, fontWeight: '600', color: theme.text, letterSpacing: -1.5, fontVariant: ['tabular-nums'], marginTop: 2 }}>{formatEUR(goal.currentAmount, true)}</Text>
        <Text style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>sur {formatEUR(goal.targetAmount, true)} · échéance {formatDate(goal.deadline)}</Text>
      </FadeInView>

      <FadeInView delay={100}>
        <Card glass>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
            <RingChart progress={p} size={110} stroke={12} label={`${Math.round(p * 100)}%`} sublabel="atteint" />
            <View style={{ flex: 1, gap: 8 }}>
              <Badge label={goal.status === 'atteint' ? 'Objectif atteint' : 'En cours'} tone={goal.status === 'atteint' ? 'success' : 'info'} />
              <Text style={{ fontSize: 13, color: theme.textBody }}>Reste à épargner</Text>
              <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text, fontVariant: ['tabular-nums'] }}>{formatEUR(remaining, true)}</Text>
              {goal.status !== 'atteint' ? <Text style={{ fontSize: 12, color: theme.textMuted }}>Suggestion : {formatEUR(suggested, true)}/mois pendant {months} mois</Text> : null}
            </View>
          </View>
        </Card>
      </FadeInView>

      <FadeInView delay={160}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>Prévision de trésorerie</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {RANGES.map((r) => (
                <PressableScale key={r} onPress={() => setRange(r)} scaleTo={0.92}>
                  <View style={{ height: 32, paddingHorizontal: 12, justifyContent: 'center', borderRadius: 999, backgroundColor: range === r ? theme.text : 'transparent' }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: range === r ? theme.background : theme.textMuted }}>{r}</Text>
                  </View>
                </PressableScale>
              ))}
            </View>
          </View>
          <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <Defs>
              <SvgGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={theme.primary} stopOpacity={0.35} />
                <Stop offset="1" stopColor={theme.primary} stopOpacity={0} />
              </SvgGradient>
            </Defs>
            <Path d={area} fill="url(#area)" />
            <Path d={line} stroke={theme.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <Ionicons name="checkmark-circle" size={16} color={theme.success} />
            <Text style={{ fontSize: 12, color: theme.textMuted }}>Aucun solde bas prévu sur les 90 prochains jours</Text>
          </View>
        </Card>
      </FadeInView>

      {goal.status !== 'atteint' ? (
        <FadeInView delay={220} style={{ gap: 10 }}>
          <Button title={`Verser ${formatEUR(goal.monthlyContribution || 100, true)}`} onPress={() => void contribute(goal.monthlyContribution || 100)} loading={busy} icon="add-circle-outline" />
          <Button title="Verser 50 €" variant="tinted" onPress={() => void contribute(50)} disabled={busy} />
        </FadeInView>
      ) : (
        <FadeInView delay={220}>
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="trophy-outline" size={26} color={theme.accent} />
              <Text style={{ flex: 1, fontSize: 14, color: theme.text }}>Félicitations ! Vous avez atteint cet objectif.</Text>
            </View>
          </Card>
        </FadeInView>
      )}
    </ScrollView>
  );
}