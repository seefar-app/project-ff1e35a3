import { useEffect, useRef, useState } from 'react';
import { Animated, Text, type TextStyle, type StyleProp } from 'react-native';

interface Props {
  value: number;
  format: (n: number) => string;
  duration?: number;
  style?: StyleProp<TextStyle>;
}

export default function CountUp({ value, format, duration = 1100, style }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const id = anim.addListener(({ value: v }) => setDisplay(v));
    Animated.timing(anim, { toValue: value, duration, useNativeDriver: false }).start();
    return () => anim.removeListener(id);
  }, [value, duration, anim]);

  return <Text style={[{ fontVariant: ['tabular-nums'] }, style]}>{format(display)}</Text>;
}