import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './../../db/entities/transaction.entity';
import { CreateTransactionInput } from './transaction.dto';
import { KafkaService } from 'src/kafka/kafka.service';

@Injectable()
export class TransactionService {
  private _pendingQueueTopic: string;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly kafkaService: KafkaService,
  ) {
    this._pendingQueueTopic = process.env.PENDING_QUEUE_TOPIC;
  }

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

    await this.kafkaService.sendMessage(
      this._pendingQueueTopic,
      newTransaction,
    );

    return this.transactionRepository.findOne({
      where: { id: newTransaction.id },
    });
  }
}
