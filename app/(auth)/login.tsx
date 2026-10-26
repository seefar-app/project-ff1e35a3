import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/useAuthStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FadeInView from '@/components/motion/FadeInView';

export default function Login() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const login = useAuthStore((s) => s.login);
  const isSubmitting = useAuthStore((s) => s.isSubmitting);
  const authError = useAuthStore((s) => s.authError);
  const clearError = useAuthStore((s) => s.clearError);
  const [email, setEmail] = useState('camille.laurent@acme-sarl.fr');
  const [password, setPassword] = useState('motdepasse');

  const submit = async () => {
    const ok = await login(email, password);
    if (ok) router.replace('/(tabs)');
  };

  const biometric = async () => {
    try {
      const hasHw = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHw || !enrolled) {
        await submit();
        return;
      }
      const res = await LocalAuthentication.authenticateAsync({ promptMessage: 'Déverrouiller MY MIB', cancelLabel: 'Annuler' });
      if (res.success) await submit();
    } catch {
      await submit();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
        <FadeInView>
          <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>M</Text>
          </View>
          <Text style={{ fontSize: 32, fontWeight: '700', color: theme.text, letterSpacing: -0.8, marginTop: 24 }}>Bon retour</Text>
          <Text style={{ fontSize: 15, color: theme.textBody, marginTop: 8 }}>Connectez-vous pour retrouver vos finances.</Text>
        </FadeInView>

        <FadeInView delay={120} style={{ gap: 16, marginTop: 32 }}>
          {authError ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 20, backgroundColor: theme.tintRed }}>
              <Ionicons name="alert-circle" size={20} color={theme.danger} />
              <Text style={{ flex: 1, color: theme.danger, fontSize: 13, fontWeight: '500' }}>{authError}</Text>
            </View>
          ) : null}
          <Input label="Adresse e-mail" icon="mail-outline" value={email} onChangeText={(t) => { clearError(); setEmail(t); }} autoCapitalize="none" keyboardType="email-address" placeholder="vous@exemple.fr" />
          <Input label="Mot de passe" icon="lock-closed-outline" value={password} onChangeText={(t) => { clearError(); setPassword(t); }} secure placeholder="Votre mot de passe" />
          <Text style={{ alignSelf: 'flex-end', color: theme.primary, fontSize: 13, fontWeight: '600' }}>Mot de passe oublié ?</Text>
          <Button title="Se connecter" onPress={submit} loading={isSubmitting} />
          <Button title="Face ID / empreinte" variant="tinted" icon="finger-print" onPress={biometric} disabled={isSubmitting} />
        </FadeInView>

        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 28 }}>
          <Text style={{ color: theme.textMuted, fontSize: 14 }}>Pas encore de compte ?</Text>
          <Text onPress={() => router.replace('/(auth)/signup')} style={{ color: theme.primary, fontSize: 14, fontWeight: '600' }}>Créer un compte</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}