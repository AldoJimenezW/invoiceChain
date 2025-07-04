import { RowDataPacket } from 'mysql2';

export interface User extends RowDataPacket {
  id: string;
  name: string;
  lastName: string;
  age: number;
  profession: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  walletAddress: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction extends RowDataPacket {
  id: number;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  status: string;
  timestamp: Date;
}

export interface Invoice extends RowDataPacket {
  id: number;
  invoiceNumber: string;
  userId: string;
  clientName: string;
  amount: number;
  status: string;
  dueDate: Date;
  createdAt: Date;
  contractAddress?: string | null;
  txHash?: string | null;
}

export interface CountResult extends RowDataPacket {
  count: number;
}

export interface Card extends RowDataPacket {
  id: number;
  userId: string;
  title: string;
  description: string | null;
  createdAt: Date;
}

export interface Craft extends RowDataPacket {
  id: number;
  userId: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
}

export interface Review extends RowDataPacket {
  id: number;
  txHash: string;
  fromAddress: string;
  toAddress: string;
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
