import { useRef, useState } from 'react';
import { Dimensions, FlatList, Text, TextInput, View, Animated, type ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import RingChart from '@/components/shared/RingChart';
import DeltaChip from '@/components/shared/DeltaChip';
import PressableScale from '@/components/motion/PressableScale';
import FadeInView from '@/components/motion/FadeInView';
import { formatEUR } from '@/utils/format';
import type { ProfileType } from '@/types';

const { width } = Dimensions.get('window');

const SLIDES = [
  { id: 's1', title: 'Votre argent, enfin clair', body: 'Un tableau de bord calme et précis pour suivre revenus, dépenses et épargne.', ring: 0.72, amount: 214831 },
  { id: 's2', title: 'Des budgets qui vous préviennent', body: 'Alertes à 75%, 90% et 100% avant de dépasser vos enveloppes.', ring: 0.58, amount: 1847 },
  { id: 's3', title: 'Des avantages qui rapportent', body: 'Offres exclusives de nos partenaires, activées en un geste.', ring: 0.9, amount: 473 },
];

const PROFILES: { id: ProfileType; label: string; desc: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'particulier', label: 'Particulier', desc: 'Budget personnel et épargne', icon: 'person-outline' },
  { id: 'professionnel', label: 'Professionnel', desc: 'Freelance et indépendant', icon: 'briefcase-outline' },
  { id: 'entreprise', label: 'Entreprise', desc: 'TVA, factures et équipe', icon: 'business-outline' },
];

export default function Onboarding() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0); // 0 slides, 1 profile, 2 income
  const [slide, setSlide] = useState(0);
  const [profileType, setProfileType] = useState<ProfileType>('particulier');
  const [income, setIncome] = useState('3200');
  const listRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) setSlide(viewableItems[0].index);
  }).current;

  const next = () => {
    if (step === 0) {
      if (slide < SLIDES.length - 1) listRef.current?.scrollToIndex({ index: slide + 1 });
      else setStep(1);
    } else if (step === 1) setStep(2);
  };

  const finish = async () => {
    const amount = parseInt(income.replace(/\D/g, ''), 10) || 0;
    await completeOnboarding(profileType, amount);
    router.replace('/(auth)/signup');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 28, height: 28, borderRadius: 9, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>M</Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text }}>MY MIB</Text>
        </View>
        <Button title="Connexion" variant="ghost" small onPress={() => router.push('/(auth)/login')} />
      </View>

      {step === 0 && (
        <>
          <Animated.FlatList
            ref={listRef as never}
            data={SLIDES}
            keyExtractor={(i) => i.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewable}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
              const tilt = scrollX.interpolate({ inputRange: [(index - 1) * width, index * width, (index + 1) * width], outputRange: ['12deg', '0deg', '-12deg'] });
              return (
                <View style={{ width, paddingHorizontal: 20, justifyContent: 'center' }}>
                  <Animated.View style={{ transform: [{ perspective: 900 }, { rotateY: tilt }] }}>
                    <Card glass>
                      <Text style={{ fontSize: 13, color: theme.textMuted }}>Total net</Text>
                      <Text style={{ fontSize: 40, fontWeight: '600', color: theme.text, letterSpacing: -1, fontVariant: ['tabular-nums'], marginTop: 2 }}>{formatEUR(item.amount, true)}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <View style={{ gap: 8 }}>
                          <DeltaChip value={14.5} />
                          <Text style={{ fontSize: 12, color: theme.textMuted }}>+3 651 € ce mois-ci</Text>
                        </View>
                        <RingChart progress={item.ring} size={96} stroke={10} label={`${Math.round(item.ring * 100)}%`} />
                      </View>
                    </Card>
                  </Animated.View>
                  <Text style={{ fontSize: 30, fontWeight: '700', color: theme.text, letterSpacing: -0.8, marginTop: 36 }}>{item.title}</Text>
                  <Text style={{ fontSize: 15, color: theme.textBody, marginTop: 10, lineHeight: 22 }}>{item.body}</Text>
                </View>
              );
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
            {SLIDES.map((s, i) => (
              <View key={s.id} style={{ width: i === slide ? 22 : 7, height: 7, borderRadius: 4, backgroundColor: i === slide ? theme.primary : isDark ? '#334155' : '#cbd5e1' }} />
            ))}
          </View>
        </>
      )}

      {step === 1 && (
        <FadeInView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 36 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, letterSpacing: -0.6 }}>Quel est votre profil ?</Text>
          <Text style={{ fontSize: 15, color: theme.textBody, marginTop: 8, marginBottom: 24 }}>Nous adaptons les outils à votre situation.</Text>
          <View style={{ gap: 12 }}>
            {PROFILES.map((p) => {
              const active = profileType === p.id;
              return (
                <PressableScale key={p.id} onPress={() => setProfileType(p.id)} haptic scaleTo={0.98}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 24, backgroundColor: theme.card, borderWidth: 2, borderColor: active ? theme.primary : theme.hairline, minHeight: 72 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: theme.tint, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={p.icon} size={21} color={theme.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>{p.label}</Text>
                      <Text style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>{p.desc}</Text>
                    </View>
                    <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={active ? theme.primary : theme.textMuted} />
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </FadeInView>
      )}

      {step === 2 && (
        <FadeInView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 36 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: theme.text, letterSpacing: -0.6 }}>Votre revenu mensuel</Text>
          <Text style={{ fontSize: 15, color: theme.textBody, marginTop: 8, marginBottom: 28 }}>Estimation nette. Vous pourrez la modifier plus tard.</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
            <TextInput
              value={income}
              onChangeText={setIncome}
              keyboardType="number-pad"
              style={{ fontSize: 56, fontWeight: '600', color: theme.text, fontVariant: ['tabular-nums'], minWidth: 120, textAlign: 'center' }}
              accessibilityLabel="Revenu mensuel"
            />
            <Text style={{ fontSize: 28, color: theme.textMuted }}>€</Text>
          </View>
          <Text style={{ textAlign: 'center', color: theme.textMuted, fontSize: 13, marginTop: 8 }}>
            Enveloppes initiales : Logement, Alimentation, Transport, Loisirs
          </Text>
        </FadeInView>
      )}

      <View style={{ paddingHorizontal: 20 }}>
        {step < 2 ? (
          <Button title={step === 0 && slide < SLIDES.length - 1 ? 'Suivant' : 'Continuer'} onPress={next} />
        ) : (
          <Button title="Créer mon compte" onPress={finish} />
        )}
      </View>
    </View>
  );
}