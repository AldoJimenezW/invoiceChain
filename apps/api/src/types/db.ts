import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  wallet_address: string;
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
  username?: string;
  email?: string;
  wallet_address?: string;
}

export interface CountResult extends RowDataPacket {
  count: number;
}
