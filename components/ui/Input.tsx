import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface Props extends TextInputProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string | null;
  secure?: boolean;
}

export default function Input({ label, icon, error, secure, ...rest }: Props) {
  const { theme, isDark } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 12, fontWeight: '500', color: theme.textMuted }}>{label}</Text>
      <View
        style={{
          height: 54,
          borderRadius: 999,
          paddingHorizontal: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderWidth: 1.5,
          borderColor: error ? theme.danger : focused ? theme.primary : theme.hairline,
        }}
      >
        {icon ? <Ionicons name={icon} size={18} color={theme.textMuted} /> : null}
        <TextInput
          {...rest}
          secureTextEntry={hidden}
          placeholderTextColor={theme.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ flex: 1, fontSize: 15, color: theme.text }}
        />
        {secure ? (
          <Pressable onPress={() => setHidden(!hidden)} hitSlop={10} accessibilityLabel="Afficher le mot de passe">
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={18} color={theme.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={{ fontSize: 12, color: theme.danger }}>{error}</Text> : null}
    </View>
  );
}