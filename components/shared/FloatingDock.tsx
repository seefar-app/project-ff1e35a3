import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  index: { on: 'home', off: 'home-outline' },
  budget: { on: 'pie-chart', off: 'pie-chart-outline' },
  offers: { on: 'gift', off: 'gift-outline' },
  profile: { on: 'person', off: 'person-outline' },
};

export default function FloatingDock({ state, navigation, descriptors }: BottomTabBarProps) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 16, alignItems: 'center' }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 999,
          backgroundColor: theme.dock,
          shadowColor: '#0f172a',
          shadowOpacity: 0.28,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const icon = ICONS[route.name] ?? ICONS.index;
          const label = descriptors[route.key].options.title ?? route.name;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: focused }}
              onPress={() => {
                void Haptics.selectionAsync();
                if (!focused) navigation.navigate(route.name);
              }}
              style={{
                width: 52,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? (isDark ? '#f8fafc' : '#ffffff') : 'transparent',
              }}
            >
              <Ionicons name={focused ? icon.on : icon.off} size={22} color={focused ? '#0f172a' : '#94a3b8'} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}