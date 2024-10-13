import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from './../db/entities/transaction.entity';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async sendMessage(topic: string, transaction: Transaction) {
    const kafkaConn = await this.kafkaClient.connect();
    const sendData = {
      id: transaction.id,
      status: transaction.statusId,
      value: transaction.value,
    };

    kafkaConn.send({
      topic,
      messages: [
        {
          key: `${sendData.id}`,
          value: JSON.stringify(sendData),
        },
      ],
    });
  }
}
