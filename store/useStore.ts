import { create } from 'zustand';
import * as Crypto from 'expo-crypto';
import type {
  Account, Budget, Category, FinancialProfile, IncomeSource, Insight, NotificationPrefs, Offer,
  Partner, ProfileType, SavingsGoal, Subscription, Transaction, UserOffer,
} from '@/types';
import {
  mockAccounts, mockBudgets, mockCategories, mockGoals, mockIncome, mockInsights, mockOffers,
  mockPartners, mockProfile, mockSubscriptions, mockTransactions, mockUserOffers, USER_ID,
} from '@/store/mockData';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface StoreState {
  isLoading: boolean;
  error: string | null;
  onboardingDone: boolean;
  profile: FinancialProfile;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  income: IncomeSource[];
  goals: SavingsGoal[];
  subscriptions: Subscription[];
  partners: Partner[];
  offers: Offer[];
  userOffers: UserOffer[];
  insights: Insight[];
  notificationPrefs: NotificationPrefs;
  dismissedInsights: string[];

  loadData: () => Promise<void>;
  refresh: () => Promise<void>;
  completeOnboarding: (profileType: ProfileType, monthlyIncome: number) => Promise<void>;
  addTransaction: (data: { amount: number; merchant: string; categoryId: string; type: 'income' | 'expense' }) => Promise<Transaction | null>;
  updateTransactionCategory: (id: string, categoryId: string) => Promise<void>;
  setBudgetAmount: (id: string, amount: number) => Promise<void>;
  addBudget: (categoryId: string, amount: number) => Promise<void>;
  addGoalContribution: (id: string, amount: number) => Promise<void>;
  activateOffer: (offerId: string) => Promise<UserOffer | null>;
  cancelSubscription: (id: string) => Promise<void>;
  toggleNotification: (key: keyof NotificationPrefs) => Promise<void>;
  setPlan: (plan: 'free' | 'plus') => Promise<void>;
  dismissInsight: (id: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  isLoading: false,
  error: null,
  onboardingDone: false,
  profile: mockProfile,
  accounts: mockAccounts,
  categories: mockCategories,
  transactions: mockTransactions,
  budgets: mockBudgets,
  income: mockIncome,
  goals: mockGoals,
  subscriptions: mockSubscriptions,
  partners: mockPartners,
  offers: mockOffers,
  userOffers: mockUserOffers,
  insights: mockInsights,
  notificationPrefs: { budget: true, bills: true, offers: true, security: true, summary: false },
  dismissedInsights: [],

  loadData: async () => {
    set({ isLoading: true, error: null });
    try {
      await wait(700);
      set({ isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Impossible de charger vos données.' });
    }
  },

  refresh: async () => {
    try {
      await wait(900);
      set({ accounts: get().accounts.map((a) => ({ ...a, lastSyncedAt: new Date().toISOString() })) });
    } catch {
      set({ error: 'Actualisation impossible.' });
    }
  },

  completeOnboarding: async (profileType, monthlyIncome) => {
    try {
      await wait(300);
      set({ onboardingDone: true, profile: { ...get().profile, monthlyIncomeTarget: monthlyIncome, plan: get().profile.plan }, error: null });
      void profileType;
    } catch {
      set({ error: 'Configuration impossible.' });
    }
  },

  addTransaction: async ({ amount, merchant, categoryId, type }) => {
    try {
      await wait(400);
      const tx: Transaction = {
        id: Crypto.randomUUID(),
        accountId: get().accounts[0].id,
        amount,
        currency: 'EUR',
        type,
        merchant,
        categoryId,
        date: new Date().toISOString(),
        status: 'categorized',
        isRecurring: false,
        receiptUrl: null,
        notes: '',
      };
      const budgets = get().budgets.map((b) =>
        type === 'expense' && b.categoryId === categoryId ? { ...b, spentAmount: b.spentAmount + amount } : b
      );
      set({ transactions: [tx, ...get().transactions], budgets });
      return tx;
    } catch {
      set({ error: 'Impossible d\'ajouter la transaction.' });
      return null;
    }
  },

  updateTransactionCategory: async (id, categoryId) => {
    try {
      await wait(200);
      set({ transactions: get().transactions.map((t) => (t.id === id ? { ...t, categoryId, status: 'categorized' } : t)) });
    } catch {
      set({ error: 'Modification impossible.' });
    }
  },

  setBudgetAmount: async (id, amount) => {
    try {
      await wait(200);
      set({ budgets: get().budgets.map((b) => (b.id === id ? { ...b, allocatedAmount: amount } : b)) });
    } catch {
      set({ error: 'Modification impossible.' });
    }
  },

  addBudget: async (categoryId, amount) => {
    try {
      await wait(250);
      if (get().budgets.some((b) => b.categoryId === categoryId)) return;
      const b: Budget = { id: Crypto.randomUUID(), userId: USER_ID, month: '2025-01', categoryId, allocatedAmount: amount, spentAmount: 0, alertThresholds: [75, 90, 100] };
      set({ budgets: [...get().budgets, b] });
    } catch {
      set({ error: 'Création impossible.' });
    }
  },

  addGoalContribution: async (id, amount) => {
    try {
      await wait(300);
      set({
        goals: get().goals.map((g) => {
          if (g.id !== id) return g;
          const current = Math.min(g.targetAmount, g.currentAmount + amount);
          return { ...g, currentAmount: current, status: current >= g.targetAmount ? 'atteint' : g.status };
        }),
      });
    } catch {
      set({ error: 'Versement impossible.' });
    }
  },

  activateOffer: async (offerId) => {
    try {
      await wait(500);
      const existing = get().userOffers.find((u) => u.offerId === offerId);
      if (existing) return existing;
      const uo: UserOffer = {
        id: Crypto.randomUUID(),
        userId: USER_ID,
        offerId,
        status: 'activated',
        activatedAt: new Date().toISOString(),
        redemptionCode: `MIB-${Crypto.randomUUID().slice(0, 4).toUpperCase()}-${Crypto.randomUUID().slice(0, 4).toUpperCase()}`,
        cashbackPending: 0,
        cashbackCredited: 0,
      };
      set({ userOffers: [uo, ...get().userOffers] });
      return uo;
    } catch {
      set({ error: 'Activation impossible.' });
      return null;
    }
  },

  cancelSubscription: async (id) => {
    try {
      await wait(250);
      set({ subscriptions: get().subscriptions.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s)) });
    } catch {
      set({ error: 'Action impossible.' });
    }
  },

  toggleNotification: async (key) => {
    const prefs = get().notificationPrefs;
    set({ notificationPrefs: { ...prefs, [key]: !prefs[key] } });
  },

  setPlan: async (plan) => {
    try {
      await wait(500);
      set({ profile: { ...get().profile, plan } });
    } catch {
      set({ error: 'Abonnement impossible.' });
    }
  },

  dismissInsight: (id) => set({ dismissedInsights: [...get().dismissedInsights, id] }),
}));

export const selectors = {
  totalBalance: (s: StoreState) => s.accounts.reduce((sum, a) => sum + a.balance, 0),
  monthIncome: (s: StoreState) => s.transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
  monthExpenses: (s: StoreState) => s.transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
};