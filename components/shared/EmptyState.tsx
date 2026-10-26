import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/ui/Button';

export default function EmptyState({ icon, title, description, actionLabel, onAction }: {
  icon: keyof typeof Ionicons.glyphMap; title: string; description: string; actionLabel?: string; onAction?: () => void;
}) {
  const { theme } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 36, paddingHorizontal: 24, gap: 10 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={28} color={theme.primary} />
      </View>
      <Text style={{ fontSize: 17, fontWeight: '600', color: theme.text }}>{title}</Text>
      <Text style={{ fontSize: 14, color: theme.textMuted, textAlign: 'center' }}>{description}</Text>
      {actionLabel ? <Button title={actionLabel} onPress={onAction} variant="tinted" small /> : null}
    </View>
  );
}