export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string | null;
  package_id: string;
  package_name: string;
  price: number;
  delivery_date: string; // YYYY-MM-DD
  pickup_date: string; // YYYY-MM-DD
  notes: string | null;
  status: OrderStatus;
  paid: boolean;
  stripe_session_id: string | null;
};

export type BlockedDate = {
  date: string; // YYYY-MM-DD
  reason: string | null;
  created_at: string;
};
