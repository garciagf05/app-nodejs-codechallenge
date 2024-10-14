import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  accountExternalIdDebit: string;

  @Field(() => String)
  accountExternalIdCredit: string;

  @Field(() => Float)
  value: number;

  @Field(() => Number)
  transactionTypeId: number;
}

export class UpdatedStatusTransactionDto {
  id: string;
  statusId: number;
  value: number;
}

export class TransactionDetailDto {
  transactionExternalId: string;
  transactionType: { name: string };
  status: { name: string };
  value: number;
  createdAt: Date;
}
