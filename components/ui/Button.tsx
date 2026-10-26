import { ActivityIndicator, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import PressableScale from '@/components/motion/PressableScale';

type Variant = 'primary' | 'tinted' | 'ghost' | 'destructive' | 'dark';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled, icon, style, small }: Props) {
  const { theme, isDark } = useTheme();
  const palette: Record<Variant, { bg: string; fg: string }> = {
    primary: { bg: theme.primary, fg: '#ffffff' },
    tinted: { bg: isDark ? theme.tintViolet : '#ede9fe', fg: theme.secondary },
    ghost: { bg: 'transparent', fg: theme.textBody },
    destructive: { bg: theme.tintRed, fg: theme.danger },
    dark: { bg: theme.text, fg: theme.background },
  };
  const c = palette[variant];
  const inactive = disabled || loading;

  return (
    <PressableScale onPress={inactive ? undefined : onPress} haptic disabled={inactive} style={style}>
      <View
        style={{
          height: small ? 40 : 54,
          borderRadius: 999,
          backgroundColor: c.bg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingHorizontal: small ? 18 : 24,
          opacity: inactive ? 0.55 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color={c.fg} />
        ) : (
          <>
            {icon ? <Ionicons name={icon} size={small ? 16 : 18} color={c.fg} /> : null}
            <Text style={{ color: c.fg, fontSize: small ? 14 : 16, fontWeight: '600' }}>{title}</Text>
          </>
        )}
      </View>
    </PressableScale>
  );
}