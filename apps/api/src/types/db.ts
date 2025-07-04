import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  name: string;
  last_name: string;
  age: number;
  profession: string;
  email: string;
  phone: string;
  password_hash: string;
  wallet_address: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: Date;
}

export interface Transaction extends RowDataPacket {
  id: number;
  tx_hash: string;
  from_address: string;
  to_address: string;
  amount: number;
  status: string;
  timestamp: Date;
}

export interface Invoice extends RowDataPacket {
  id: number;
  invoice_number: string;
  user_id: number;
  client_name: string;
  amount: number;
  status: string;
  due_date: Date;
  created_at: Date;
  contract_address?: string;
  tx_hash?: string;
  name?: string;
  last_name?: string;
  email?: string;
  wallet_address?: string;
}

export interface CountResult extends RowDataPacket {
  count: number;
}

export interface Card extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  description: string;
  created_at: Date;
}

export interface Craft extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  description: string;
  image: string;
  created_at: Date;
}

export interface Review extends RowDataPacket {
  id: number;
  tx_hash: string;
  from_address: string;
  to_address: string;
  rating: number;
  comment: string;
  timestamp: Date;
}
