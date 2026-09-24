import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  seedAccounts,
  seedCategories,
  seedProfile,
  seedTransactions,
  type Account,
  type Category,
  type Profile,
  type Transaction,
} from "./finance-data";

const uid = () => Math.random().toString(36).slice(2, 10);

interface FinanceContextValue {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  profile: Profile;
  signedIn: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
  updateProfile: (p: Profile) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, t: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  addAccount: (a: Omit<Account, "id">) => void;
  updateAccount: (id: string, a: Omit<Account, "id">) => void;
  removeAccount: (id: string) => void;
  addCategory: (c: Omit<Category, "id">) => void;
  updateCategory: (id: string, c: Omit<Category, "id">) => void;
  removeCategory: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [accounts, setAccounts] = useState<Account[]>(seedAccounts);
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [profile, setProfile] = useState<Profile>(seedProfile);
  const [signedIn, setSignedIn] = useState(false);

  const signIn = useCallback((email: string) => {
    if (email) setProfile((p) => ({ ...p, email }));
    setSignedIn(true);
  }, []);

  const value = useMemo<FinanceContextValue>(
    () => ({
      transactions,
      accounts,
      categories,
      profile,
      signedIn,
      signIn,
      signOut: () => setSignedIn(false),
      updateProfile: setProfile,
      addTransaction: (t) => setTransactions((list) => [{ ...t, id: uid() }, ...list]),
      updateTransaction: (id, t) =>
        setTransactions((list) => list.map((x) => (x.id === id ? { ...t, id } : x))),
      removeTransaction: (id) => setTransactions((list) => list.filter((x) => x.id !== id)),
      addAccount: (a) => setAccounts((list) => [...list, { ...a, id: uid() }]),
      updateAccount: (id, a) =>
        setAccounts((list) => list.map((x) => (x.id === id ? { ...a, id } : x))),
      removeAccount: (id) => setAccounts((list) => list.filter((x) => x.id !== id)),
      addCategory: (c) => setCategories((list) => [...list, { ...c, id: uid() }]),
      updateCategory: (id, c) =>
        setCategories((list) => list.map((x) => (x.id === id ? { ...c, id } : x))),
      removeCategory: (id) => setCategories((list) => list.filter((x) => x.id !== id)),
    }),
    [transactions, accounts, categories, profile, signedIn, signIn],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance precisa estar dentro de FinanceProvider");
  return ctx;
}

export function useCategoryName() {
  const { categories } = useFinance();
  return (id: string) => categories.find((c) => c.id === id)?.name ?? "Sem categoria";
}

export function useAccountName() {
  const { accounts } = useFinance();
  return (id: string) => accounts.find((a) => a.id === id)?.name ?? "Sem conta";
}
