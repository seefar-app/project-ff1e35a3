import type {
  Account, Budget, Category, FinancialProfile, IncomeSource, Insight, Offer, Partner,
  SavingsGoal, Subscription, Transaction, User, UserOffer,
} from '@/types';
import { addDays, subDays, formatISO } from 'date-fns';

const today = new Date();
const d = (offset: number) => formatISO(offset >= 0 ? addDays(today, offset) : subDays(today, -offset));

export const USER_ID = '7d2f8c1e-4b6a-4f0e-9a31-1c5e2b8f9a01';

export const mockUser: User = {
  id: USER_ID,
  firstName: 'Camille',
  lastName: 'Laurent',
  email: 'camille.laurent@acme-sarl.fr',
  phone: '+33 6 12 34 56 78',
  avatarUrl: 'https://randomuser.me/api/portraits/women/46.jpg',
  profileType: 'professionnel',
  twoFactorEnabled: true,
  biometricEnabled: true,
  locale: 'fr-FR',
  created_at: d(-210),
};

export const mockProfile: FinancialProfile = {
  userId: USER_ID,
  monthlyIncomeTarget: 4200,
  currency: 'EUR',
  companyName: 'Acme SARL',
  siret: '812 345 678 00019',
  vatRegistered: true,
  plan: 'free',
};

export const mockAccounts: Account[] = [
  { id: 'a1b2c3d4-0001-4000-8000-000000000001', userId: USER_ID, name: 'Compte courant', type: 'courant', institution: 'Crédit Mutuel', iban: 'FR76 •••• •••• 4521', balance: 3184.62, currency: 'EUR', lastSyncedAt: d(0), connectionStatus: 'connected' },
  { id: 'a1b2c3d4-0002-4000-8000-000000000002', userId: USER_ID, name: 'Livret A', type: 'epargne', institution: 'Crédit Mutuel', iban: 'FR76 •••• •••• 9087', balance: 12450.0, currency: 'EUR', lastSyncedAt: d(0), connectionStatus: 'connected' },
  { id: 'a1b2c3d4-0003-4000-8000-000000000003', userId: USER_ID, name: 'Compte pro Acme', type: 'professionnel', institution: 'Qonto', iban: 'FR76 •••• •••• 1156', balance: 8920.4, currency: 'EUR', lastSyncedAt: d(-1), connectionStatus: 'connected' },
  { id: 'a1b2c3d4-0004-4000-8000-000000000004', userId: USER_ID, name: 'Espèces', type: 'especes', institution: 'Manuel', iban: '—', balance: 140.0, currency: 'EUR', lastSyncedAt: d(-3), connectionStatus: 'connected' },
];

export const mockCategories: Category[] = [
  { id: 'cat-logement', name: 'Logement', icon: 'home-outline', colour: '#38bdf8' },
  { id: 'cat-alimentation', name: 'Alimentation', icon: 'cart-outline', colour: '#10b981' },
  { id: 'cat-transport', name: 'Transport', icon: 'train-outline', colour: '#8b5cf6' },
  { id: 'cat-loisirs', name: 'Loisirs', icon: 'film-outline', colour: '#f59e0b' },
  { id: 'cat-energie', name: 'Énergie', icon: 'flash-outline', colour: '#ef4444' },
  { id: 'cat-revenus', name: 'Revenus', icon: 'cash-outline', colour: '#10b981' },
  { id: 'cat-sante', name: 'Santé', icon: 'medkit-outline', colour: '#ec4899' },
];

const A1 = mockAccounts[0].id;
const A3 = mockAccounts[2].id;

export const mockTransactions: Transaction[] = [
  { id: 'tx-0001', accountId: A3, amount: 3850, currency: 'EUR', type: 'income', merchant: 'Acme SARL', categoryId: 'cat-revenus', date: d(-2), status: 'cleared', isRecurring: true, receiptUrl: null, notes: 'Salaire du mois' },
  { id: 'tx-0002', accountId: A1, amount: 74.32, currency: 'EUR', type: 'expense', merchant: 'Carrefour', categoryId: 'cat-alimentation', date: d(0), status: 'categorized', isRecurring: false, receiptUrl: null, notes: '' },
  { id: 'tx-0003', accountId: A1, amount: 12.5, currency: 'EUR', type: 'expense', merchant: 'SNCF', categoryId: 'cat-transport', date: d(-1), status: 'categorized', isRecurring: false, receiptUrl: null, notes: 'Billet TER' },
  { id: 'tx-0004', accountId: A1, amount: 96.8, currency: 'EUR', type: 'expense', merchant: 'EDF', categoryId: 'cat-energie', date: d(-3), status: 'cleared', isRecurring: true, receiptUrl: null, notes: 'Facture électricité' },
  { id: 'tx-0005', accountId: A1, amount: 13.49, currency: 'EUR', type: 'expense', merchant: 'Netflix', categoryId: 'cat-loisirs', date: d(-4), status: 'categorized', isRecurring: true, receiptUrl: null, notes: '' },
  { id: 'tx-0006', accountId: A1, amount: 820, currency: 'EUR', type: 'expense', merchant: 'Loyer · Foncia', categoryId: 'cat-logement', date: d(-5), status: 'cleared', isRecurring: true, receiptUrl: null, notes: 'Loyer mensuel' },
  { id: 'tx-0007', accountId: A1, amount: 58.9, currency: 'EUR', type: 'expense', merchant: 'Le Bistrot Parisien', categoryId: 'cat-loisirs', date: d(-6), status: 'flagged', isRecurring: false, receiptUrl: null, notes: 'Dîner client' },
  { id: 'tx-0008', accountId: A1, amount: 41.2, currency: 'EUR', type: 'expense', merchant: 'Monoprix', categoryId: 'cat-alimentation', date: d(-7), status: 'categorized', isRecurring: false, receiptUrl: null, notes: '' },
  { id: 'tx-0009', accountId: A3, amount: 1200, currency: 'EUR', type: 'income', merchant: 'Facture #2024-017 · Lumière Studio', categoryId: 'cat-revenus', date: d(-9), status: 'cleared', isRecurring: false, receiptUrl: null, notes: 'Mission freelance' },
  { id: 'tx-0010', accountId: A1, amount: 36.5, currency: 'EUR', type: 'expense', merchant: 'Pharmacie du Centre', categoryId: 'cat-sante', date: d(-10), status: 'categorized', isRecurring: false, receiptUrl: null, notes: '' },
];

export const mockBudgets: Budget[] = [
  { id: 'bud-1', userId: USER_ID, month: '2025-01', categoryId: 'cat-logement', allocatedAmount: 900, spentAmount: 820, alertThresholds: [75, 90, 100] },
  { id: 'bud-2', userId: USER_ID, month: '2025-01', categoryId: 'cat-alimentation', allocatedAmount: 450, spentAmount: 372, alertThresholds: [75, 90, 100] },
  { id: 'bud-3', userId: USER_ID, month: '2025-01', categoryId: 'cat-transport', allocatedAmount: 150, spentAmount: 92, alertThresholds: [75, 90, 100] },
  { id: 'bud-4', userId: USER_ID, month: '2025-01', categoryId: 'cat-loisirs', allocatedAmount: 200, spentAmount: 214, alertThresholds: [75, 90, 100] },
  { id: 'bud-5', userId: USER_ID, month: '2025-01', categoryId: 'cat-energie', allocatedAmount: 130, spentAmount: 96.8, alertThresholds: [75, 90, 100] },
];

export const mockIncome: IncomeSource[] = [
  { id: 'inc-1', userId: USER_ID, label: 'Salaire · Acme SARL', amount: 3850, frequency: 'monthly', nextDate: d(26), type: 'salaire' },
  { id: 'inc-2', userId: USER_ID, label: 'Freelance · Lumière Studio', amount: 1200, frequency: 'one_off', nextDate: d(14), type: 'freelance' },
];

export const mockGoals: SavingsGoal[] = [
  { id: 'goal-1', userId: USER_ID, name: 'Vacances au Japon', icon: 'airplane-outline', targetAmount: 4000, currentAmount: 2650, deadline: d(150), monthlyContribution: 270, status: 'en_cours' },
  { id: 'goal-2', userId: USER_ID, name: 'Fonds d\'urgence', icon: 'shield-checkmark-outline', targetAmount: 10000, currentAmount: 7400, deadline: d(300), monthlyContribution: 260, status: 'en_cours' },
  { id: 'goal-3', userId: USER_ID, name: 'Nouveau MacBook', icon: 'laptop-outline', targetAmount: 1800, currentAmount: 1800, deadline: d(-20), monthlyContribution: 0, status: 'atteint' },
];

export const mockSubscriptions: Subscription[] = [
  { id: 'sub-1', userId: USER_ID, merchant: 'Netflix', amount: 13.49, frequency: 'monthly', nextChargeDate: d(8), status: 'active' },
  { id: 'sub-2', userId: USER_ID, merchant: 'Spotify', amount: 10.99, frequency: 'monthly', nextChargeDate: d(12), status: 'active' },
  { id: 'sub-3', userId: USER_ID, merchant: 'Salle Fitness Park', amount: 29.9, frequency: 'monthly', nextChargeDate: d(5), status: 'flagged' },
  { id: 'sub-4', userId: USER_ID, merchant: 'Canal+', amount: 24.99, frequency: 'monthly', nextChargeDate: d(19), status: 'flagged' },
];

export const mockPartners: Partner[] = [
  { id: 'p-edf', name: 'EDF', category: 'energie', icon: 'flash-outline', colour: '#f59e0b' },
  { id: 'p-sfr', name: 'SFR', category: 'telecom', icon: 'phone-portrait-outline', colour: '#ef4444' },
  { id: 'p-axa', name: 'AXA', category: 'assurance', icon: 'shield-outline', colour: '#38bdf8' },
  { id: 'p-sncf', name: 'SNCF Connect', category: 'voyage', icon: 'train-outline', colour: '#8b5cf6' },
  { id: 'p-fnac', name: 'Fnac Darty', category: 'shopping', icon: 'bag-handle-outline', colour: '#10b981' },
  { id: 'p-boursorama', name: 'Boursorama', category: 'banque', icon: 'business-outline', colour: '#ec4899' },
];

export const mockOffers: Offer[] = [
  { id: 'off-1', partnerId: 'p-edf', title: '−15% sur votre contrat d\'électricité', description: 'Offre verte exclusive réservée aux membres MY MIB.', discountLabel: '−15%', estimatedSaving: 180, conditions: 'Valable pour tout nouveau contrat souscrit avant la date d\'expiration. Engagement de 12 mois.', expiryDate: d(40), isExclusive: true },
  { id: 'off-2', partnerId: 'p-sfr', title: 'Forfait 5G à 9,99 €/mois', description: 'Sans engagement, 100 Go inclus.', discountLabel: '9,99 €', estimatedSaving: 96, conditions: 'Réservé aux nouveaux clients. Offre limitée dans le temps.', expiryDate: d(25), isExclusive: false },
  { id: 'off-3', partnerId: 'p-axa', title: 'Assurance habitation : 2 mois offerts', description: 'Protégez votre logement et économisez dès la première année.', discountLabel: '2 mois', estimatedSaving: 38, conditions: 'Valable pour toute souscription en ligne.', expiryDate: d(60), isExclusive: true },
  { id: 'off-4', partnerId: 'p-sncf', title: '5% de cashback sur vos billets', description: 'Cashback crédité sous 30 jours sur votre solde MY MIB.', discountLabel: '5% cashback', estimatedSaving: 42, conditions: 'Billets Inoui et Intercités. Plafonné à 50 € par mois.', expiryDate: d(90), isExclusive: false },
  { id: 'off-5', partnerId: 'p-fnac', title: '−10% sur l\'électronique', description: 'Code promo membre valable en magasin et en ligne.', discountLabel: '−10%', estimatedSaving: 65, conditions: 'Hors produits Apple. Une utilisation par membre.', expiryDate: d(30), isExclusive: false },
  { id: 'off-6', partnerId: 'p-boursorama', title: '150 € offerts à l\'ouverture', description: 'Prime de bienvenue pour un compte pro.', discountLabel: '150 €', estimatedSaving: 150, conditions: 'Dépôt initial de 500 € requis.', expiryDate: d(75), isExclusive: true },
];

export const mockUserOffers: UserOffer[] = [
  { id: 'uo-1', userId: USER_ID, offerId: 'off-4', status: 'activated', activatedAt: d(-6), redemptionCode: 'MIB-SNCF-5C8K', cashbackPending: 7.4, cashbackCredited: 0 },
  { id: 'uo-2', userId: USER_ID, offerId: 'off-5', status: 'redeemed', activatedAt: d(-30), redemptionCode: 'MIB-FNAC-2X91', cashbackPending: 0, cashbackCredited: 24.0 },
];

export const mockInsights: Insight[] = [
  { id: 'ins-1', userId: USER_ID, type: 'overspend', message: 'Vous avez dépensé 32% de plus en restaurants et loisirs ce mois-ci.', actionLabel: 'Voir le budget', created_at: d(0) },
  { id: 'ins-2', userId: USER_ID, type: 'subscription', message: 'Deux abonnements semblent peu utilisés : économisez 54,89 € par mois.', actionLabel: 'Examiner', created_at: d(-1) },
  { id: 'ins-3', userId: USER_ID, type: 'offer', message: 'Votre facture EDF est élevée : une offre à −15% vous attend.', actionLabel: 'Voir l\'offre', created_at: d(-2) },
];