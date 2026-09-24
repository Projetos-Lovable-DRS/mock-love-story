export type TransactionType = "receita" | "despesa";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface Account {
  id: string;
  name: string;
  institution: string;
  balance: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  date: string; // ISO yyyy-mm-dd
}

export interface Profile {
  name: string;
  email: string;
}

export const seedCategories: Category[] = [
  { id: "c1", name: "Moradia", type: "despesa" },
  { id: "c2", name: "Alimentação", type: "despesa" },
  { id: "c3", name: "Transporte", type: "despesa" },
  { id: "c4", name: "Lazer", type: "despesa" },
  { id: "c5", name: "Saúde", type: "despesa" },
  { id: "c6", name: "Assinaturas", type: "despesa" },
  { id: "c7", name: "Salário", type: "receita" },
  { id: "c8", name: "Freelas", type: "receita" },
];

export const seedAccounts: Account[] = [
  { id: "a1", name: "Conta Corrente", institution: "Banco do Brasil", balance: 9420.55 },
  { id: "a2", name: "Conta Digital", institution: "Nubank", balance: 6180.0 },
  { id: "a3", name: "Poupança", institution: "Caixa", balance: 8230.0 },
  { id: "a4", name: "Carteira", institution: "Dinheiro em espécie", balance: 1000.0 },
];

export const seedTransactions: Transaction[] = [
  { id: "t1", description: "Salário — Estúdio Vértice", amount: 8200, type: "receita", categoryId: "c7", accountId: "a1", date: "2024-11-05" },
  { id: "t2", description: "Freela — Projeto Aurora", amount: 2400, type: "receita", categoryId: "c8", accountId: "a2", date: "2024-11-09" },
  { id: "t3", description: "Aluguel — Rua das Acácias", amount: 2850, type: "despesa", categoryId: "c1", accountId: "a1", date: "2024-11-06" },
  { id: "t4", description: "Internet fibra — Vivo", amount: 109, type: "despesa", categoryId: "c1", accountId: "a1", date: "2024-11-10" },
  { id: "t5", description: "Conta de energia — Enel", amount: 218.4, type: "despesa", categoryId: "c1", accountId: "a1", date: "2024-11-12" },
  { id: "t6", description: "Mercado São Jorge", amount: 342.8, type: "despesa", categoryId: "c2", accountId: "a2", date: "2024-11-18" },
  { id: "t7", description: "Padaria Aurora", amount: 78.5, type: "despesa", categoryId: "c2", accountId: "a4", date: "2024-11-14" },
  { id: "t8", description: "Uber — deslocamento", amount: 41.2, type: "despesa", categoryId: "c3", accountId: "a2", date: "2024-11-17" },
  { id: "t9", description: "Combustível — Posto Ipiranga", amount: 280, type: "despesa", categoryId: "c3", accountId: "a1", date: "2024-11-11" },
  { id: "t10", description: "Cinema com a família", amount: 132, type: "despesa", categoryId: "c4", accountId: "a2", date: "2024-11-16" },
  { id: "t11", description: "Farmácia Popular", amount: 89.9, type: "despesa", categoryId: "c5", accountId: "a2", date: "2024-11-15" },
  { id: "t12", description: "Plano odontológico", amount: 149, type: "despesa", categoryId: "c5", accountId: "a1", date: "2024-11-08" },
  { id: "t13", description: "Assinatura Netflix", amount: 55.9, type: "despesa", categoryId: "c6", accountId: "a2", date: "2024-11-18" },
  { id: "t14", description: "Spotify Família", amount: 34.9, type: "despesa", categoryId: "c6", accountId: "a2", date: "2024-11-13" },
  { id: "t15", description: "Salário — Estúdio Vértice", amount: 8200, type: "receita", categoryId: "c7", accountId: "a1", date: "2024-10-05" },
  { id: "t16", description: "Freela — Identidade visual", amount: 1500, type: "receita", categoryId: "c8", accountId: "a2", date: "2024-10-19" },
  { id: "t17", description: "Aluguel — Rua das Acácias", amount: 2850, type: "despesa", categoryId: "c1", accountId: "a1", date: "2024-10-06" },
  { id: "t18", description: "Mercado São Jorge", amount: 410.3, type: "despesa", categoryId: "c2", accountId: "a2", date: "2024-10-12" },
  { id: "t19", description: "Manutenção do carro", amount: 620, type: "despesa", categoryId: "c3", accountId: "a1", date: "2024-10-22" },
  { id: "t20", description: "Show no Teatro Municipal", amount: 240, type: "despesa", categoryId: "c4", accountId: "a4", date: "2024-10-26" },
  { id: "t21", description: "Salário — Estúdio Vértice", amount: 7900, type: "receita", categoryId: "c7", accountId: "a1", date: "2024-09-05" },
  { id: "t22", description: "Aluguel — Rua das Acácias", amount: 2850, type: "despesa", categoryId: "c1", accountId: "a1", date: "2024-09-06" },
  { id: "t23", description: "Mercado São Jorge", amount: 380.1, type: "despesa", categoryId: "c2", accountId: "a2", date: "2024-09-15" },
  { id: "t24", description: "Consulta médica", amount: 320, type: "despesa", categoryId: "c5", accountId: "a1", date: "2024-09-20" },
  { id: "t25", description: "Freela — Consultoria", amount: 1800, type: "receita", categoryId: "c8", accountId: "a2", date: "2024-09-24" },
];

export const seedProfile: Profile = {
  name: "Maria Costa",
  email: "maria.costa@email.com",
};

/** Mês de referência dos dados de demonstração. */
export const CURRENT_MONTH = "2024-11";
