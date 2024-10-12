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
