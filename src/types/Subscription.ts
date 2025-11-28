export type Currency = 'USD' | 'HNL';
export type Frequency = 'monthly' | 'yearly';

export interface Subscription {
  id?: number;
  name: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  payment_date: string;
  created_at?: string;
}