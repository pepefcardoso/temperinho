export type CustomerContact = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: string;
  created_at?: string;
};

export type NewsletterCustomer = {
  id: number;
  email: string;
  created_at: string;
};
