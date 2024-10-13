import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TransferType } from './transferType.entity';
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

  @Field(() => TransferType)
  @ManyToOne(() => TransferType, { eager: true, nullable: false })
  transferType: TransferType;

  @Field(() => Number)
  @Column()
  transferTypeId: number;

  @Field(() => Status)
  @ManyToOne(() => Status, { eager: true, nullable: false })
  status: Status;

  @Field(() => Status)
  @Column({ default: 1 })
  statusId: number;
}
