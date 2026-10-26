import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { formatEUR } from '@/utils/format';
import PressableScale from '@/components/motion/PressableScale';

interface Item { id: string; name: string; icon: string; colour: string; amount: number }

export default function AllocationChips({ items, onPress }: { items: Item[]; onPress?: (id: string) => void }) {
  const { theme } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
      {items.map((it) => (
        <PressableScale key={it.id} onPress={() => onPress?.(it.id)} scaleTo={0.95}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: theme.card, borderRadius: 999, paddingVertical: 8, paddingLeft: 8, paddingRight: 14, borderWidth: 0.5, borderColor: theme.cardBorder }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: it.colour + '22', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={it.icon as keyof typeof Ionicons.glyphMap} size={15} color={it.colour} />
            </View>
            <View>
              <Text style={{ fontSize: 11, color: theme.textMuted }}>{it.name}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text, fontVariant: ['tabular-nums'] }}>{formatEUR(it.amount, true)}</Text>
            </View>
          </View>
        </PressableScale>
      ))}
    </ScrollView>
  );
}