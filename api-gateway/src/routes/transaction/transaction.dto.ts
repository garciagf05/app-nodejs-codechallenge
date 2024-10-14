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
  transferTypeId: number;
}

export class UpdatedStatusTransactionDTO {
  id: string;
  statusId: number;
  value: number;
}
