import help from './functions/help';
import product_review from './functions/product_review';

export const functionFactory = {
  // Add your functions here
  product_review,
  help,
} as const;

export type FunctionFactoryType = keyof typeof functionFactory;
