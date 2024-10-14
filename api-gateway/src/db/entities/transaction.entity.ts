import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransactionType } from './transactionType.entity';
import { Status } from './status.entity';
import { Account } from './account.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Transaction {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Account)
  @ManyToOne(() => Account, { eager: true, nullable: false })
  @JoinColumn({ name: 'accountDebitId' })
  accountExternalIdDebit: Account;

  @Field(() => String)
  @Column()
  accountDebitId: string;

  @Field(() => Account)
  @ManyToOne(() => Account, { eager: true, nullable: false })
  @JoinColumn({ name: 'accountCreditId' })
  accountExternalIdCredit: Account;

  @Field(() => String)
  @Column()
  accountCreditId: string;

  @Field(() => Number)
  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Field(() => TransactionType)
  @ManyToOne(() => TransactionType, { eager: true, nullable: false })
  transactionType: TransactionType;

  @Field(() => Number)
  @Column()
  transactionTypeId: number;

  @Field(() => Status)
  @ManyToOne(() => Status, { eager: true, nullable: false })
  status: Status;

  @Field(() => Status)
  @Column({ default: 1 })
  statusId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  creationDate: Date;
}
