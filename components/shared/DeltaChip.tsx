import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export default function DeltaChip({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const { theme } = useTheme();
  const up = value >= 0;
  const color = up ? theme.success : theme.danger;
  const bg = up ? theme.tintGreen : theme.tintRed;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 }}>
      <Ionicons name={up ? 'trending-up' : 'trending-down'} size={12} color={color} />
      <Text style={{ fontSize: 12, fontWeight: '600', color }}>{Math.abs(value).toFixed(1).replace('.', ',')}{suffix}</Text>
    </View>
  );
}