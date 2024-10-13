import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { KafkaConsumerService } from './kafka.consumer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud-api',
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'antifraud-consumer-group',
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  controllers: [KafkaController],
  providers: [KafkaConsumerService],
})
export class KafkaModule {}
