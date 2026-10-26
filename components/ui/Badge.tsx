import { Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'neutral';

export default function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const { theme, isDark } = useTheme();
  const map: Record<Tone, { bg: string; fg: string }> = {
    success: { bg: theme.tintGreen, fg: isDark ? '#6ee7b7' : '#059669' },
    warning: { bg: theme.tintAmber, fg: isDark ? '#fcd34d' : '#b45309' },
    danger: { bg: theme.tintRed, fg: isDark ? '#fca5a5' : '#dc2626' },
    info: { bg: theme.tint, fg: isDark ? '#7dd3fc' : '#0284c7' },
    violet: { bg: theme.tintViolet, fg: isDark ? '#c4b5fd' : '#7c3aed' },
    neutral: { bg: isDark ? '#1e293b' : '#f1f5f9', fg: theme.textMuted },
  };
  const c = map[tone];
  return (
    <View style={{ backgroundColor: c.bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}>
      <Text style={{ color: c.fg, fontSize: 11, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}