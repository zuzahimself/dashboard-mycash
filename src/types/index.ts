/**
 * Tipos TypeScript das entidades principais do mycash+
 */

export type TransactionType = 'income' | 'expense';

export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface Transaction {
  id: string;
  type: TransactionType;
  value: number;
  description: string;
  category: string;
  date: string; // ISO 8601
  accountId: string; // BankAccount.id ou CreditCard.id
  memberId: string | null;
  installments: number; // 1 = à vista
  status: TransactionStatus;
  isRecurring: boolean;
  isPaid: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null; // ISO 8601
  description?: string;
}

export type CreditCardTheme = 'black' | 'lime' | 'white';

export interface CreditCard {
  id: string;
  name: string;
  holderId: string; // FamilyMember.id
  closingDay: number; // 1-31
  dueDay: number; // 1-31
  limit: number;
  currentBill: number;
  theme: CreditCardTheme;
  lastDigits?: string; // 4 dígitos
}

export interface BankAccount {
  id: string;
  name: string;
  holderId: string; // FamilyMember.id
  balance: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string; // Pai, Mãe, Filho, etc.
  avatarUrl?: string;
  email?: string;
  monthlyIncome: number;
}
