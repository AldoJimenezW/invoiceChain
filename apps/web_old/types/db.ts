import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id: string;
  name: string;
  last_name: string;
  age: number;
  profession: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  password_hash: string;
  wallet_address: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
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
  user_id: string;
  client_name: string;
  amount: number;
  status: string;
  due_date: Date;
  created_at: Date;
  contract_address?: string | null;
  tx_hash?: string | null;
}

export interface CountResult extends RowDataPacket {
  count: number;
}

export interface Card extends RowDataPacket {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  created_at: Date;
}

export interface Craft extends RowDataPacket {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  image: string | null;
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

export interface Session extends RowDataPacket {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
}

export interface Account extends RowDataPacket {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Verification extends RowDataPacket {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
}
