import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import {
  PendingTransactionDTO,
  StatusDTO,
  ValidatedTransactionDTO,
} from './kafka.dto';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private _pendingQueueTopic: string;
  private _validatedQueueTopic: string;
  private _maximunTramsactionValue: number;
  private _statusData: StatusDTO;

  private _kafka = new Kafka({
    clientId: 'anti-fraud-api',
    brokers: [process.env.KAFKA_BROKER],
  });
  private _consumer = this._kafka.consumer({
    groupId: 'anti-fraud-consumer-group',
  });
  private _producer = this._kafka.producer();

  constructor() {
    this._pendingQueueTopic = process.env.PENDING_QUEUE_TOPIC;
    this._validatedQueueTopic = process.env.VALIDATED_QUEUE_TOPIC;
    this._maximunTramsactionValue = 1000;
    this._statusData = {
      APPROVED: 2,
      REJECTED: 3,
    };
  }

  async onModuleInit() {
    await this._consumer.connect();
    await this._producer.connect();
    await this._consumer.subscribe({
      topic: this._pendingQueueTopic,
      fromBeginning: true,
    });

    await this._consumer.run({
      eachMessage: async ({ topic, message }) => {
        console.log(
          `Received transaction: ${message.value} from topic: ${topic}`,
        );
        const transactionData = message.value.toString();
        await this._validateTransaction(transactionData);
      },
    });
  }

  async _validateTransaction(message: string) {
    const validatedTransaction: PendingTransactionDTO = JSON.parse(message);

    if (validatedTransaction.value > this._maximunTramsactionValue) {
      validatedTransaction.statusId = this._statusData.REJECTED;
    } else {
      validatedTransaction.statusId = this._statusData.APPROVED;
    }

    await this._sendMessage(this._validatedQueueTopic, validatedTransaction);
  }

  async _sendMessage(topic: string, message: ValidatedTransactionDTO) {
    await this._producer.send({
      topic,
      messages: [
        {
          key: `${message.id}`,
          value: JSON.stringify(message),
        },
      ],
    });
  }

  async onModuleDestroy() {
    await this._consumer.disconnect();
    await this._producer.disconnect();
  }
}
