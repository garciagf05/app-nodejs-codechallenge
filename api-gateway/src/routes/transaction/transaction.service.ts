import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './../../db/entities/transaction.entity';
import { CreateTransactionInput } from './transaction.dto';
import { KafkaService } from 'src/kafka/kafka.service';

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

  async updateStatus(updatedTransaction: string) {
    const transactionToUpdate = JSON.parse(updatedTransaction);
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
      transferTypeId: createTransactionInput.transferTypeId,
      value: createTransactionInput.value,
    });

    try {
      await this.transactionRepository.save(newTransaction);
      const transaction = await this.transactionRepository.findOne({
        where: { id: newTransaction.id },
      });
      await this.kafkaService.sendMessage(this._pendingQueueTopic, transaction);
      return transaction;
    } catch (error) {
      console.log('Data save transaction error: ', error);
      await this.transactionRepository.delete(newTransaction);
      throw new error(error);
    }
  }
}
