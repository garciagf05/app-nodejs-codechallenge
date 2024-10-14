import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './../../db/entities/transaction.entity';
import {
  CreateTransactionInput,
  UpdatedStatusTransactionDto,
} from './transaction.dto';
import { KafkaService } from './../../kafka/kafka.service';

@Injectable()
export class TransactionService implements OnModuleInit {
  private _pendingQueueTopic: string;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly kafkaService: KafkaService,
  ) {
    this._pendingQueueTopic = process.env.PENDING_QUEUE_TOPIC;
  }

  async onModuleInit() {
    await this.kafkaService.consumer.run({
      eachMessage: async ({ topic, message }) => {
        console.log(
          `Received transaction: ${message.value} from topic: ${topic}`,
        );
        const updatedTransaction: string = message.value.toString();
        this.updateStatus(updatedTransaction);
      },
    });
  }

  async getDetail(transactionExternalId: string): Promise<Transaction> {
    try {
      const transaction: Transaction = await this.findTransaction(
        transactionExternalId,
      );
      console.log('TransactionFinded =>', JSON.stringify(transaction));
      if (!transaction) {
        throw new Error(`Id not found on DB: ${transactionExternalId}`);
      }

      return transaction;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateStatus(updatedTransaction: string) {
    const transactionToUpdate: UpdatedStatusTransactionDto =
      JSON.parse(updatedTransaction);
    try {
      await this.transactionRepository.update(
        { id: transactionToUpdate.id },
        { statusId: transactionToUpdate.statusId },
      );
      console.log(
        `Status update to ${transactionToUpdate.statusId} on transaction ${transactionToUpdate.id}`,
      );
    } catch (error) {
      console.log(
        `Error trying to update the transactiomn ${transactionToUpdate.id}, error: `,
        error,
      );
    }
  }

  async create(
    createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create({
      accountCreditId: createTransactionInput.accountExternalIdCredit,
      accountDebitId: createTransactionInput.accountExternalIdDebit,
      transactionTypeId: createTransactionInput.transactionTypeId,
      value: createTransactionInput.value,
      creationDate: new Date(),
    });

    try {
      await this.transactionRepository.save(newTransaction);
      const transaction = await this.findTransaction(newTransaction.id);
      await this.kafkaService.sendMessage(this._pendingQueueTopic, transaction);
      return transaction;
    } catch (error) {
      await this.transactionRepository.delete(newTransaction);
      throw new Error(error);
    }
  }

  findTransaction(id: string): Promise<Transaction> {
    return this.transactionRepository.findOne({
      where: { id },
    });
  }
}
