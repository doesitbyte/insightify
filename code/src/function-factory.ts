import company_review from './functions/company_review';
import help from './functions/help';
import product_review from './functions/product_review';

export const functionFactory = {
  // Add your functions here
  product_review,
  company_review,
  help,
} as const;

export type FunctionFactoryType = keyof typeof functionFactory;
