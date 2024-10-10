import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): CreateTransactionDto {
    return createTransactionDto;
  }
}
