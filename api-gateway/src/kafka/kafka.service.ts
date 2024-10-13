import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { Transaction } from 'src/db/entities/transaction.entity';

@Injectable()
export class KafkaService {
  private kafka = new Kafka({
    clientId: 'api-gateway',
    brokers: [process.env.KAFKA_BROKER], // Dirección del broker de Kafka
  });
  private producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async sendMessage(topic: string, message: Transaction) {
    const transaction = {
      id: message.id,
      statusId: message.statusId,
      value: message.value,
    };
    await this.producer.send({
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
    await this.producer.disconnect();
  }
}
