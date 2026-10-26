import { type ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import PressableScale from '@/components/motion/PressableScale';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  glass?: boolean;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}

export default function Card({ children, onPress, glass = false, style, padded = true }: Props) {
  const { theme, isDark } = useTheme();
  const base: ViewStyle = {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: theme.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.cardBorder,
    shadowColor: '#0f172a',
    shadowOpacity: isDark ? 0 : 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: isDark ? 0 : 2,
  };

  const inner = (
    <View style={[base, style]}>
      {glass && Platform.OS !== 'android' ? (
        <BlurView tint={isDark ? 'dark' : 'light'} intensity={50} style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={padded ? { padding: 20 } : undefined}>{children}</View>
    </View>
  );

  if (onPress) {
    return <PressableScale onPress={onPress} scaleTo={0.98}>{inner}</PressableScale>;
  }
  return inner;
}