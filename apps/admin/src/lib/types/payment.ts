import { PaymentMethod } from "./paymentMethod";
import { Subscription } from "./subscription";

export type Payment = {
  id: number;
  amount: number;
  status: string;
  notes?: string | null;
  due_date: string;
  paid_at?: string | null;
  created_at: string;
  subscription?: Subscription;
  payment_method?: PaymentMethod;
};