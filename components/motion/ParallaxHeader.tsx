import { useRef, type ReactNode } from 'react';
import { Animated, View } from 'react-native';

export function useScrollY() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true });
  return { scrollY, onScroll };
}

export default function ParallaxHeader({ scrollY, height = 280, children }: { scrollY: Animated.Value; height?: number; children: ReactNode }) {
  const translateY = scrollY.interpolate({ inputRange: [-height, 0, height], outputRange: [-height / 2, 0, height * 0.35] });
  const scale = scrollY.interpolate({ inputRange: [-height, 0], outputRange: [1.4, 1], extrapolateRight: 'clamp' });
  const rotateX = scrollY.interpolate({ inputRange: [0, height], outputRange: ['0deg', '14deg'], extrapolate: 'clamp' });
  const opacity = scrollY.interpolate({ inputRange: [0, height * 0.9], outputRange: [1, 0.2], extrapolate: 'clamp' });
  return (
    <View style={{ height }}>
      <Animated.View style={{ flex: 1, opacity, transform: [{ perspective: 800 }, { translateY }, { scale }, { rotateX }] }}>
        {children}
      </Animated.View>
    </View>
  );
}