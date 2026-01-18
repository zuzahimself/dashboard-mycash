import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  BankAccount,
  CreditCard,
  FamilyMember,
  Goal,
  Transaction,
} from '@/types';

// --- Filtros globais ---
export type TransactionTypeFilter = 'all' | 'income' | 'expense';

export interface DateRange {
  startDate: string; // ISO 8601
  endDate: string;
}

function getDefaultDateRange(): DateRange {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function generateId(): string {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11);
}

// --- Dados mock (categorias padrão brasileiras, 3 membros, 3 cartões, contas, 4 objetivos, 25+ transações) ---
const MOCK_FAMILY: FamilyMember[] = [
  { id: 'fm1', name: 'João Silva', role: 'Pai', monthlyIncome: 8500, email: 'joao@email.com' },
  { id: 'fm2', name: 'Maria Santos', role: 'Mãe', monthlyIncome: 5200, email: 'maria@email.com' },
  { id: 'fm3', name: 'Pedro Silva', role: 'Filho', monthlyIncome: 0 },
];

const MOCK_CARDS: CreditCard[] = [
  { id: 'cc1', name: 'Nubank', holderId: 'fm1', closingDay: 15, dueDay: 22, limit: 8000, currentBill: 2100, theme: 'black', lastDigits: '1234' },
  { id: 'cc2', name: 'Itaú', holderId: 'fm2', closingDay: 10, dueDay: 17, limit: 5000, currentBill: 890, theme: 'lime', lastDigits: '5678' },
  { id: 'cc3', name: 'Bradesco', holderId: 'fm1', closingDay: 5, dueDay: 12, limit: 6000, currentBill: 0, theme: 'white', lastDigits: '9012' },
  { id: 'cc4', name: 'C6 Bank', holderId: 'fm1', closingDay: 8, dueDay: 15, limit: 10000, currentBill: 3200, theme: 'black', lastDigits: '4567' },
];

const MOCK_ACCOUNTS: BankAccount[] = [
  { id: 'ba1', name: 'Nubank Conta', holderId: 'fm1', balance: 6200 },
  { id: 'ba2', name: 'Itaú Corrente', holderId: 'fm2', balance: 3100 },
  { id: 'ba3', name: 'Carteira', holderId: 'fm1', balance: 450 },
];

const MOCK_GOALS: Goal[] = [
  { id: 'g1', name: 'Viagem em família', targetAmount: 15000, currentAmount: 4200, deadline: '2025-12-31', description: 'Férias em dezembro' },
  { id: 'g2', name: 'Reserva de emergência', targetAmount: 25000, currentAmount: 12500, deadline: null, description: '6 meses de despesas' },
  { id: 'g3', name: 'Troca do carro', targetAmount: 45000, currentAmount: 8000, deadline: '2026-06-30' },
  { id: 'g4', name: 'Curso de idiomas', targetAmount: 3600, currentAmount: 1200, deadline: '2025-08-31', description: 'Inglês online' },
];

function lastMonths(months: number): string[] {
  const d = new Date();
  const out: string[] = [];
  for (let i = 0; i < months * 31; i++) {
    const x = new Date(d);
    x.setDate(x.getDate() - i);
    out.push(x.toISOString().slice(0, 10));
  }
  return out;
}

const SAMPLE_DATES = lastMonths(3);
const CATEGORIAS_BR = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Mercado', 'Contas', 'Investimentos', 'Salário', 'Outros'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number): number { return Math.round(min + Math.random() * (max - min)); }

const MOCK_TRANSACTIONS: Transaction[] = (() => {
  const list: Transaction[] = [];
  const acc = [...MOCK_ACCOUNTS.map(a => a.id), ...MOCK_CARDS.map(c => c.id)];
  const members: (string | null)[] = ['fm1', 'fm2', 'fm3', null];
  const n = new Date();
  const fmt = (day: number) => `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  for (let i = 0; i < 28; i++) {
    const isIncome = i < 4 || (i > 10 && i < 14);
    const category = isIncome ? 'Salário' : pick(CATEGORIAS_BR.filter(c => c !== 'Salário'));
    const value = isIncome ? rand(2500, 9000) : rand(25, 850);
    list.push({
      id: 'tx' + (i + 1),
      type: isIncome ? 'income' : 'expense',
      value,
      description: isIncome ? 'Salário' : `${category} - ${['Mercado Atacadão', 'Uber', 'Luz', 'Farmácia', 'Netflix', 'iFood', 'Posto', 'Extra'][i % 8]}`,
      category,
      date: pick(SAMPLE_DATES),
      accountId: pick(acc),
      memberId: pick(members),
      installments: isIncome ? 1 : (rand(1, 3) === 3 ? rand(2, 6) : 1),
      status: 'completed',
      isRecurring: isIncome || category === 'Moradia' || category === 'Contas',
      isPaid: true,
    });
  }
  // Despesas pendentes (isPaid: false) para o widget Próximas despesas
  list.push(
    { id: 'tx-p1', type: 'expense', value: 150, description: 'Luz', category: 'Contas', date: fmt(25), accountId: 'ba1', memberId: 'fm1', installments: 1, status: 'completed', isRecurring: true, isPaid: false },
    { id: 'tx-p2', type: 'expense', value: 55, description: 'Netflix', category: 'Lazer', date: fmt(12), accountId: 'cc1', memberId: 'fm1', installments: 1, status: 'completed', isRecurring: true, isPaid: false },
    { id: 'tx-p3', type: 'expense', value: 120, description: 'Academia', category: 'Saúde', date: fmt(18), accountId: 'ba2', memberId: 'fm2', installments: 1, status: 'completed', isRecurring: false, isPaid: false },
    { id: 'tx-p4', type: 'expense', value: 90, description: 'Conta de água', category: 'Contas', date: fmt(8), accountId: 'cc2', memberId: 'fm2', installments: 1, status: 'completed', isRecurring: true, isPaid: false },
  );
  return list.sort((a, b) => b.date.localeCompare(a.date));
})();

// --- Context ---
interface FinanceContextValue {
  // Entidades
  transactions: Transaction[];
  goals: Goal[];
  creditCards: CreditCard[];
  bankAccounts: BankAccount[];
  familyMembers: FamilyMember[];
  // Filtros
  selectedMember: string | null;
  dateRange: DateRange;
  transactionType: TransactionTypeFilter;
  searchText: string;
  setSelectedMember: (id: string | null) => void;
  setDateRange: (range: DateRange) => void;
  setTransactionType: (t: TransactionTypeFilter) => void;
  setSearchText: (t: string) => void;
  // CRUD
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (g: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, g: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addCreditCard: (c: Omit<CreditCard, 'id'>) => void;
  updateCreditCard: (id: string, c: Partial<CreditCard>) => void;
  deleteCreditCard: (id: string) => void;
  addBankAccount: (a: Omit<BankAccount, 'id'>) => void;
  updateBankAccount: (id: string, a: Partial<BankAccount>) => void;
  deleteBankAccount: (id: string) => void;
  addFamilyMember: (f: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMember: (id: string, f: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;
  // Derivadas (aplicam filtros)
  getFilteredTransactions: () => Transaction[];
  calculateTotalBalance: () => number;
  calculateIncomeForPeriod: () => number;
  calculateExpensesForPeriod: () => number;
  calculateExpensesByCategory: () => Record<string, number>;
  calculateCategoryPercentage: (category: string) => number;
  calculateSavingsRate: () => number;
  getBalanceGrowthPercent: () => number; // % vs mês anterior (mock por enquanto)
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(MOCK_CARDS);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(MOCK_ACCOUNTS);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(MOCK_FAMILY);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange);
  const [transactionType, setTransactionType] = useState<TransactionTypeFilter>('all');
  const [searchText, setSearchText] = useState('');

  // --- CRUD ---
  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [...prev, { ...t, id: generateId() }]);
  }, []);
  const updateTransaction = useCallback((id: string, t: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((x) => (x.id === id ? { ...x, ...t } : x)));
  }, []);
  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addGoal = useCallback((g: Omit<Goal, 'id'>) => {
    setGoals((prev) => [...prev, { ...g, id: generateId() }]);
  }, []);
  const updateGoal = useCallback((id: string, g: Partial<Goal>) => {
    setGoals((prev) => prev.map((x) => (x.id === id ? { ...x, ...g } : x)));
  }, []);
  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addCreditCard = useCallback((c: Omit<CreditCard, 'id'>) => {
    setCreditCards((prev) => [...prev, { ...c, id: generateId() }]);
  }, []);
  const updateCreditCard = useCallback((id: string, c: Partial<CreditCard>) => {
    setCreditCards((prev) => prev.map((x) => (x.id === id ? { ...x, ...c } : x)));
  }, []);
  const deleteCreditCard = useCallback((id: string) => {
    setCreditCards((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addBankAccount = useCallback((a: Omit<BankAccount, 'id'>) => {
    setBankAccounts((prev) => [...prev, { ...a, id: generateId() }]);
  }, []);
  const updateBankAccount = useCallback((id: string, a: Partial<BankAccount>) => {
    setBankAccounts((prev) => prev.map((x) => (x.id === id ? { ...x, ...a } : x)));
  }, []);
  const deleteBankAccount = useCallback((id: string) => {
    setBankAccounts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addFamilyMember = useCallback((f: Omit<FamilyMember, 'id'>) => {
    setFamilyMembers((prev) => [...prev, { ...f, id: generateId() }]);
  }, []);
  const updateFamilyMember = useCallback((id: string, f: Partial<FamilyMember>) => {
    setFamilyMembers((prev) => prev.map((x) => (x.id === id ? { ...x, ...f } : x)));
  }, []);
  const deleteFamilyMember = useCallback((id: string) => {
    setFamilyMembers((prev) => prev.filter((x) => x.id !== id));
  }, []);

  // --- Derivadas (aplicam filtros) ---
  const getFilteredTransactions = useCallback(() => {
    let list = [...transactions];
    if (selectedMember != null) {
      list = list.filter((t) => t.memberId === selectedMember);
    }
    list = list.filter((t) => t.date >= dateRange.startDate && t.date <= dateRange.endDate);
    if (transactionType !== 'all') {
      list = list.filter((t) => t.type === transactionType);
    }
    const q = searchText.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    return list;
  }, [transactions, selectedMember, dateRange, transactionType, searchText]);

  const calculateTotalBalance = useCallback(() => {
    let accounts = bankAccounts;
    let cards = creditCards;
    if (selectedMember != null) {
      accounts = accounts.filter((a) => a.holderId === selectedMember);
      cards = cards.filter((c) => c.holderId === selectedMember);
    }
    const sumAccounts = accounts.reduce((s, a) => s + a.balance, 0);
    const sumCardBills = cards.reduce((s, c) => s + c.currentBill, 0);
    return sumAccounts - sumCardBills;
  }, [bankAccounts, creditCards, selectedMember]);

  const calculateIncomeForPeriod = useCallback(() => {
    return getFilteredTransactions()
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.value, 0);
  }, [getFilteredTransactions]);

  const calculateExpensesForPeriod = useCallback(() => {
    return getFilteredTransactions()
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.value, 0);
  }, [getFilteredTransactions]);

  const calculateExpensesByCategory = useCallback(() => {
    const list = getFilteredTransactions().filter((t) => t.type === 'expense');
    const map: Record<string, number> = {};
    for (const t of list) {
      map[t.category] = (map[t.category] ?? 0) + t.value;
    }
    return map;
  }, [getFilteredTransactions]);

  const calculateCategoryPercentage = useCallback(
    (category: string): number => {
      const byCat = calculateExpensesByCategory();
      const total = Object.values(byCat).reduce((s, v) => s + v, 0);
      if (total <= 0) return 0;
      return ((byCat[category] ?? 0) / total) * 100;
    },
    [calculateExpensesByCategory]
  );

  const calculateSavingsRate = useCallback((): number => {
    const income = calculateIncomeForPeriod();
    const expenses = calculateExpensesForPeriod();
    if (income <= 0) return 0;
    return ((income - expenses) / income) * 100;
  }, [calculateIncomeForPeriod, calculateExpensesForPeriod]);

  const getBalanceGrowthPercent = useCallback((): number => {
    // TODO: comparar saldo do mês atual vs anterior; por enquanto mock
    return 12;
  }, []);

  const value = useMemo<FinanceContextValue>(
    () => ({
      transactions,
      goals,
      creditCards,
      bankAccounts,
      familyMembers,
      selectedMember,
      dateRange,
      transactionType,
      searchText,
      setSelectedMember,
      setDateRange,
      setTransactionType,
      setSearchText,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      addCreditCard,
      updateCreditCard,
      deleteCreditCard,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      getFilteredTransactions,
      calculateTotalBalance,
      calculateIncomeForPeriod,
      calculateExpensesForPeriod,
      calculateExpensesByCategory,
      calculateCategoryPercentage,
      calculateSavingsRate,
      getBalanceGrowthPercent,
    }),
    [
      transactions,
      goals,
      creditCards,
      bankAccounts,
      familyMembers,
      selectedMember,
      dateRange,
      transactionType,
      searchText,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      addCreditCard,
      updateCreditCard,
      deleteCreditCard,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      getFilteredTransactions,
      calculateTotalBalance,
      calculateIncomeForPeriod,
      calculateExpensesForPeriod,
      calculateExpensesByCategory,
      calculateCategoryPercentage,
      calculateSavingsRate,
      getBalanceGrowthPercent,
    ]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance(): FinanceContextValue {
  const ctx = useContext(FinanceContext);
  if (ctx == null) {
    throw new Error('useFinance deve ser usado dentro de FinanceProvider');
  }
  return ctx;
}
