export type ProfileType = 'particulier' | 'professionnel' | 'entreprise';
export type PlanType = 'free' | 'plus';
export type AccountType = 'courant' | 'epargne' | 'especes' | 'professionnel';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'pending' | 'cleared' | 'categorized' | 'flagged';
export type BudgetStatus = 'on_track' | 'warning' | 'exceeded';
export type OfferStatus = 'available' | 'activated' | 'redeemed' | 'expired';
export type OfferCategory = 'energie' | 'telecom' | 'assurance' | 'voyage' | 'shopping' | 'banque';
export type GoalStatus = 'en_cours' | 'atteint' | 'en_pause';
export type SubscriptionStatus = 'active' | 'flagged' | 'cancelled';
export type IconName = string;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  profileType: ProfileType;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  locale: string;
  created_at: string;
}

export interface FinancialProfile {
  userId: string;
  monthlyIncomeTarget: number;
  currency: string;
  companyName: string;
  siret: string;
  vatRegistered: boolean;
  plan: PlanType;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  institution: string;
  iban: string;
  balance: number;
  currency: string;
  lastSyncedAt: string;
  connectionStatus: 'connected' | 'expired';
}

export interface Category {
  id: string;
  name: string;
  icon: IconName;
  colour: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  merchant: string;
  categoryId: string;
  date: string;
  status: TransactionStatus;
  isRecurring: boolean;
  receiptUrl: string | null;
  notes: string;
}

export interface Budget {
  id: string;
  userId: string;
  month: string;
  categoryId: string;
  allocatedAmount: number;
  spentAmount: number;
  alertThresholds: number[];
}

export interface IncomeSource {
  id: string;
  userId: string;
  label: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'yearly' | 'one_off';
  nextDate: string;
  type: 'salaire' | 'freelance' | 'locatif' | 'autre';
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  icon: IconName;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyContribution: number;
  status: GoalStatus;
}

export interface Subscription {
  id: string;
  userId: string;
  merchant: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
  nextChargeDate: string;
  status: SubscriptionStatus;
}

export interface Partner {
  id: string;
  name: string;
  category: OfferCategory;
  icon: IconName;
  colour: string;
}

export interface Offer {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  discountLabel: string;
  estimatedSaving: number;
  conditions: string;
  expiryDate: string;
  isExclusive: boolean;
}

export interface UserOffer {
  id: string;
  userId: string;
  offerId: string;
  status: OfferStatus;
  activatedAt: string | null;
  redemptionCode: string | null;
  cashbackPending: number;
  cashbackCredited: number;
}

export interface Insight {
  id: string;
  userId: string;
  type: 'overspend' | 'saving_tip' | 'subscription' | 'offer';
  message: string;
  actionLabel: string;
  created_at: string;
}

export interface NotificationPrefs {
  budget: boolean;
  bills: boolean;
  offers: boolean;
  security: boolean;
  summary: boolean;
}