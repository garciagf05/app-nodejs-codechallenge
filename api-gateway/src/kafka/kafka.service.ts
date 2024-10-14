import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { Transaction } from 'src/db/entities/transaction.entity';

@Injectable()
export class KafkaService {
  private _validatedQueueTopic: string = process.env.VALIDATED_QUEUE_TOPIC;
  private _kafka = new Kafka({
    clientId: 'api-gateway',
    brokers: [process.env.KAFKA_BROKER],
  });
  private _producer = this._kafka.producer();
  consumer = this._kafka.consumer({ groupId: 'api-gateway-group' });

  async onModuleInit() {
    await this._producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: this._validatedQueueTopic,
      fromBeginning: false,
    });
  }

  async sendMessage(topic: string, message: Transaction) {
    const transaction = {
      id: message.id,
      statusId: message.statusId,
      value: message.value,
    };
    await this._producer.send({
      topic,
      messages: [
        {
          key: `${transaction.id}`,
          value: JSON.stringify(transaction),
        },
      ],
    });
  }

  async onModuleDestroy() {
    await this._producer.disconnect();
    await this.consumer.disconnect();
  }
}
