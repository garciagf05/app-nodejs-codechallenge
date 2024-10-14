import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput, TransactionDetailDto } from './transaction.dto';
import { Transaction } from 'src/db/entities/transaction.entity';

@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => String)
  async hello(): Promise<string> {
    return 'Mandatory @Query';
  }

  @Query(() => Transaction)
  async transaction(
    @Args('transactionExternalId') transactionExternalId: string,
  ): Promise<Transaction> {
    return this.transactionService.getDetail(transactionExternalId);
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<Transaction> {
    return this.transactionService.create(input);
  }
}
