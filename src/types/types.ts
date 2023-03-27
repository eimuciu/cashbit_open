export interface ExpenseData {
  _id?: string;
  date: string;
  category: string;
  description: string;
  amount: string;
}

export interface IncomeData {
  _id?: string;
  date: string;
  source: string;
  description: string;
  amount: string;
}

export interface CommonData {
  isExpenseOrIncomeTable: boolean;
  selectedChart: string;
  currentPage: number;
  currentPageIncome: number;
  postsPerPage: number;
}

export interface SettingsData {
  _id?: string;
  expenseCategory: string[];
  incomeSource: string[];
  colors: {};
  budget:
    | { date: Date; items: Array<{ category: string; budget: string }> }[]
    | [];
  currency: string;
}

export interface UserObj {
  email: string;
  uid: string;
}
