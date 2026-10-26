import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.primary }}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}