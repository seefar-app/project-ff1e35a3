import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useStore } from '@/store/useStore';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/shared/SectionHeader';
import EmptyState from '@/components/shared/EmptyState';
import FadeInView from '@/components/motion/FadeInView';
import PressableScale from '@/components/motion/PressableScale';
import { formatDate, formatEUR } from '@/utils/format';
import type { OfferCategory } from '@/types';

const FILTERS: { id: OfferCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'energie', label: 'Énergie' },
  { id: 'telecom', label: 'Télécom' },
  { id: 'assurance', label: 'Assurance' },
  { id: 'voyage', label: 'Voyage' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'banque', label: 'Banque' },
];

const { height: H } = Dimensions.get('window');

export default function OffersScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const offers = useStore((s) => s.offers);
  const partners = useStore((s) => s.partners);
  const userOffers = useStore((s) => s.userOffers);
  const activateOffer = useStore((s) => s.activateOffer);
  const [filter, setFilter] = useState<OfferCategory | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const translateY = useRef(new Animated.Value(H)).current;

  const selected = offers.find((o) => o.id === selectedId) ?? null;
  const selectedPartner = partners.find((p) => p.id === selected?.partnerId);
  const selectedUO = userOffers.find((u) => u.offerId === selectedId);

  useEffect(() => {
    Animated.spring(translateY, { toValue: selectedId ? 0 : H, useNativeDriver: true, damping: 20, stiffness: 160 }).start();
  }, [selectedId, translateY]);

  const list = offers.filter((o) => filter === 'all' || partners.find((p) => p.id === o.partnerId)?.category === filter);
  const totalSavings = userOffers.reduce((s, u) => s + (offers.find((o) => o.id === u.offerId)?.estimatedSaving ?? 0), 0);
  const cashbackPending = userOffers.reduce((s, u) => s + u.cashbackPending, 0);
  const cashbackCredited = userOffers.reduce((s, u) => s + u.cashbackCredited, 0);

  const onActivate = async () => {
    if (!selected) return;
    setActivating(true);
    await activateOffer(selected.id);
    setActivating(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 120, gap: 20 }} showsVerticalScrollIndicator={false}>
        <FadeInView style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 34, fontWeight: '700', color: theme.text, letterSpacing: -1 }}>Avantages</Text>
          <Text style={{ fontSize: 14, color: theme.textMuted, marginTop: 2 }}>Offres exclusives de nos partenaires</Text>
        </FadeInView>

        <FadeInView delay={80} style={{ paddingHorizontal: 20 }}>
          <Card glass>
            <Text style={{ fontSize: 13, color: theme.textMuted }}>Économies estimées</Text>
            <Text style={{ fontSize: 40, fontWeight: '600', color: theme.text, letterSpacing: -1.2, fontVariant: ['tabular-nums'], marginTop: 2 }}>{formatEUR(totalSavings, true)}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <View style={{ flex: 1, padding: 12, borderRadius: 20, backgroundColor: theme.tintAmber }}>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>Cashback en attente</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, fontVariant: ['tabular-nums'] }}>{formatEUR(cashbackPending)}</Text>
              </View>
              <View style={{ flex: 1, padding: 12, borderRadius: 20, backgroundColor: theme.tintGreen }}>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>Cashback crédité</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.success, fontVariant: ['tabular-nums'] }}>{formatEUR(cashbackCredited)}</Text>
              </View>
            </View>
          </Card>
        </FadeInView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <PressableScale key={f.id} onPress={() => setFilter(f.id)} scaleTo={0.95}>
                <View style={{ height: 40, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 999, backgroundColor: active ? theme.text : theme.card, borderWidth: 0.5, borderColor: theme.cardBorder }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: active ? theme.background : theme.textBody }}>{f.label}</Text>
                </View>
              </PressableScale>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          <SectionHeader title="Pour vous" />
          {list.length === 0 ? (
            <Card><EmptyState icon="gift-outline" title="Aucune offre" description="Aucune offre ne correspond à ce filtre pour le moment." /></Card>
          ) : null}
          {list.map((o, i) => {
            const partner = partners.find((p) => p.id === o.partnerId);
            const uo = userOffers.find((u) => u.offerId === o.id);
            return (
              <FadeInView key={o.id} delay={i * 50}>
                <Card onPress={() => setSelectedId(o.id)} style={{ borderRadius: 24 }}>
                  <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: (partner?.colour ?? theme.primary) + '22', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={(partner?.icon ?? 'gift-outline') as keyof typeof Ionicons.glyphMap} size={22} color={partner?.colour ?? theme.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 12, color: theme.textMuted }}>{partner?.name}</Text>
                      <Text numberOfLines={2} style={{ fontSize: 15, fontWeight: '600', color: theme.text, marginTop: 1 }}>{o.title}</Text>
                      <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                        <Badge label={o.discountLabel} tone="violet" />
                        {o.isExclusive ? <Badge label="Exclusif" tone="info" /> : null}
                        {uo ? <Badge label={uo.status === 'redeemed' ? 'Utilisée' : 'Activée'} tone="success" /> : null}
                      </View>
                    </View>
                  </View>
                </Card>
              </FadeInView>
            );
          })}
        </View>
      </ScrollView>

      <Modal transparent visible={selectedId !== null} animationType="fade" onRequestClose={() => setSelectedId(null)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.45)' }} onPress={() => setSelectedId(null)} />
        <Animated.View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, transform: [{ translateY }], backgroundColor: theme.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: insets.bottom + 24 }}>
          <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: theme.hairline, marginBottom: 18 }} />
          {selected ? (
            <View style={{ gap: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: (selectedPartner?.colour ?? theme.primary) + '22', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={(selectedPartner?.icon ?? 'gift-outline') as keyof typeof Ionicons.glyphMap} size={22} color={selectedPartner?.colour ?? theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>{selectedPartner?.name}</Text>
                  <Text style={{ fontSize: 17, fontWeight: '600', color: theme.text }}>{selected.title}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, color: theme.textBody, lineHeight: 21 }}>{selected.description}</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1, padding: 14, borderRadius: 20, backgroundColor: theme.tintGreen }}>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>Économie estimée</Text>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: theme.success, fontVariant: ['tabular-nums'] }}>{formatEUR(selected.estimatedSaving, true)}</Text>
                </View>
                <View style={{ flex: 1, padding: 14, borderRadius: 20, backgroundColor: theme.tintAmber }}>
                  <Text style={{ fontSize: 11, color: theme.textMuted }}>Expire le</Text>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.text, marginTop: 4 }}>{formatDate(selected.expiryDate)}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: theme.textMuted, lineHeight: 18 }}>{selected.conditions}</Text>
              {selectedUO?.redemptionCode ? (
                <View style={{ padding: 16, borderRadius: 24, backgroundColor: theme.tint, alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>Votre code</Text>
                  <Text style={{ fontSize: 24, fontWeight: '700', letterSpacing: 2, color: theme.text }}>{selectedUO.redemptionCode}</Text>
                  <Ionicons name="qr-code-outline" size={56} color={theme.text} />
                </View>
              ) : (
                <Button title="Activer l'offre" onPress={onActivate} loading={activating} icon="flash-outline" />
              )}
            </View>
          ) : null}
        </Animated.View>
      </Modal>
    </View>
  );
}