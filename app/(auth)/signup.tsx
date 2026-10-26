import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/useAuthStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FadeInView from '@/components/motion/FadeInView';

export default function Signup() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const signup = useAuthStore((s) => s.signup);
  const isSubmitting = useAuthStore((s) => s.isSubmitting);
  const authError = useAuthStore((s) => s.authError);
  const clearError = useAuthStore((s) => s.clearError);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    const ok = await signup(firstName, lastName, email, password);
    if (ok) router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
        <FadeInView>
          <Text style={{ fontSize: 32, fontWeight: '700', color: theme.text, letterSpacing: -0.8 }}>Créer votre compte</Text>
          <Text style={{ fontSize: 15, color: theme.textBody, marginTop: 8 }}>Sécurisé, chiffré et conforme au RGPD.</Text>
        </FadeInView>

        <FadeInView delay={120} style={{ gap: 16, marginTop: 28 }}>
          {authError ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 20, backgroundColor: theme.tintRed }}>
              <Ionicons name="alert-circle" size={20} color={theme.danger} />
              <Text style={{ flex: 1, color: theme.danger, fontSize: 13, fontWeight: '500' }}>{authError}</Text>
            </View>
          ) : null}
          <Input label="Prénom" icon="person-outline" value={firstName} onChangeText={(t) => { clearError(); setFirstName(t); }} placeholder="Camille" />
          <Input label="Nom" icon="person-outline" value={lastName} onChangeText={(t) => { clearError(); setLastName(t); }} placeholder="Laurent" />
          <Input label="Adresse e-mail" icon="mail-outline" value={email} onChangeText={(t) => { clearError(); setEmail(t); }} autoCapitalize="none" keyboardType="email-address" placeholder="vous@exemple.fr" />
          <Input label="Mot de passe (8 caractères min.)" icon="lock-closed-outline" value={password} onChangeText={(t) => { clearError(); setPassword(t); }} secure placeholder="Choisissez un mot de passe" />
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            <Ionicons name="shield-checkmark-outline" size={18} color={theme.accent} />
            <Text style={{ flex: 1, fontSize: 12, color: theme.textMuted, lineHeight: 18 }}>
              En continuant, vous acceptez nos conditions et consentez à l'agrégation sécurisée de vos comptes (open banking). Révocable à tout moment.
            </Text>
          </View>
          <Button title="Créer mon compte" onPress={submit} loading={isSubmitting} />
        </FadeInView>

        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 28 }}>
          <Text style={{ color: theme.textMuted, fontSize: 14 }}>Déjà inscrit ?</Text>
          <Text onPress={() => router.replace('/(auth)/login')} style={{ color: theme.primary, fontSize: 14, fontWeight: '600' }}>Se connecter</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}