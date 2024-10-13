import { Injectable } from '@nestjs/common';
import { PendingTransactionDTO } from './kafka.dto';

@Injectable()
export class KafkaConsumerService {
  private _validatedQueueTopic: string;

  constructor() {
    this._validatedQueueTopic = process.env.VALIDATED_QUEUE_TOPIC;
  }

  async validateTransaction(message: any) {
    console.log('Received transaction from pending queue =>', message.value);

    const { value } = message;
    const validatedTransaction: PendingTransactionDTO = JSON.parse(value);

    if (value > 1000) {
      validatedTransaction.statusId = 3;
    } else {
      validatedTransaction.statusId = 2;
    }

    return validatedTransaction;
    // this.kafkaClient.emit(this._validatedQueueTopic, validatedTransaction);
  }
}
