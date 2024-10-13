import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'api-gateway',
      brokers: [process.env.KAFKA_BROKER || 'kafka:29092'],
    });

    this.producer = this.kafka.producer();
  }

  async sendMessage(topic: string, message: any) {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
    await this.producer.disconnect();
  }
}
