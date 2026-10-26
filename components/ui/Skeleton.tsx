import { useEffect, useRef } from 'react';
import { Animated, type DimensionValue } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function Skeleton({ width = '100%', height = 16, radius = 12 }: { width?: DimensionValue; height?: number; radius?: number }) {
  const { isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={{ width, height, borderRadius: radius, backgroundColor: isDark ? '#1e293b' : '#e2e8f0', opacity }} />;
}