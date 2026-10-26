import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import { formatEUR, formatShortDate } from '@/utils/format';
import type { Transaction } from '@/types';
import PressableScale from '@/components/motion/PressableScale';

export default function TransactionRow({ tx, onPress }: { tx: Transaction; onPress?: () => void }) {
  const { theme } = useTheme();
  const category = useStore((s) => s.categories.find((c) => c.id === tx.categoryId));
  const income = tx.type === 'income';
  const colour = category?.colour ?? theme.primary;
  return (
    <PressableScale onPress={onPress} scaleTo={0.98}>
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 60, gap: 14, paddingVertical: 8 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colour + '22', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={(category?.icon ?? 'cash-outline') as keyof typeof Ionicons.glyphMap} size={20} color={colour} />
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: '600', color: theme.text }}>{tx.merchant}</Text>
          <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{category?.name ?? 'Autre'} · {formatShortDate(tx.date)}{tx.status === 'flagged' ? ' · à vérifier' : ''}</Text>
        </View>
        <Text style={{ fontSize: 15, fontWeight: '600', color: income ? theme.success : theme.text, fontVariant: ['tabular-nums'] }}>
          {income ? '+' : '−'}{formatEUR(tx.amount)}
        </Text>
      </View>
    </PressableScale>
  );
}