import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaConsumerService } from './kafka.consumer.service';

@Controller()
export class KafkaController {
  private _pendingQueueTopic: string;

  constructor(
    private readonly kafkaConsumerService: KafkaConsumerService,
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {
    this._pendingQueueTopic = process.env.PENDING_QUEUE_TOPIC;
  }

  async onModuleInit() {
    try {
      this.kafkaClient.subscribeToResponseOf(this._pendingQueueTopic);
      await this.kafkaClient.connect().then(() => {
        console.log(
          'Connected to Kafka and subscribed to',
          this._pendingQueueTopic,
        );
      });
    } catch (error) {
      console.error('Error connecting to Kafka:', error);
    }
  }

  @MessagePattern(process.env.PENDING_QUEUE_TOPIC)
  handlePendingQueue(@Payload() message: any): any {
    console.log('Al menos entra');
    return this.kafkaConsumerService.validateTransaction(message.value);
  }
}
