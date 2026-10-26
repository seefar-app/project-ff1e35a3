import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  progress: number; // 0..1
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function RingChart({ progress, size = 120, stroke = 12, label, sublabel }: Props) {
  const { theme, isDark } = useTheme();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const anim = useRef(new Animated.Value(0)).current;
  const [, force] = useState(0);

  useEffect(() => {
    Animated.timing(anim, { toValue: Math.max(0, Math.min(1, progress)), duration: 1200, useNativeDriver: false }).start(() => force((n) => n + 1));
  }, [progress, anim]);

  const dashOffset = anim.interpolate({ inputRange: [0, 1], outputRange: [c, 0] });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <SvgGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={theme.primary} />
            <Stop offset="1" stopColor={theme.secondary} />
          </SvgGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {label ? (
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <Text style={{ fontSize: size * 0.2, fontWeight: '700', color: theme.text, fontVariant: ['tabular-nums'] }}>{label}</Text>
          {sublabel ? <Text style={{ fontSize: 10, color: theme.textMuted, marginTop: 1 }}>{sublabel}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}