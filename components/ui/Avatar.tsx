import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function Avatar({ uri, name, size = 44 }: { uri?: string; name: string; size?: number }) {
  const { theme } = useTheme();
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: theme.primary, fontWeight: '700', fontSize: size * 0.36 }}>{initials}</Text>
    </View>
  );
}