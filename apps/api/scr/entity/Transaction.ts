import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  txHash: string;

  @Column()
  fromAddress: string;

  @Column()
  toAddress: string;

  @Column("decimal", { precision: 18, scale: 8 })
  amount: number;

  @Column()
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp: Date;
}
