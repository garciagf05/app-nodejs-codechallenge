import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './../../db/entities/transaction.entity';
import { CreateTransactionInput } from './transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create({
      accountCreditId: createTransactionInput.accountExternalIdCredit,
      accountDebitId: createTransactionInput.accountExternalIdDebit,
      transferTypeId: createTransactionInput.transferTypeId,
      value: createTransactionInput.value,
    });

    await this.transactionRepository.save(newTransaction);
    return this.transactionRepository.findOne({
      where: { id: newTransaction.id },
    });
  }
}
