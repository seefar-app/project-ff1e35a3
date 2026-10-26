import { useColorScheme } from 'react-native';
import { Colors, type Theme } from '@/constants/Colors';

export function useTheme(): { theme: Theme; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return { theme: isDark ? Colors.dark : Colors.light, isDark };
}