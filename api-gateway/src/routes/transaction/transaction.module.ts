import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/db/entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), KafkaModule],
  providers: [TransactionService, TransactionResolver],
})
export class TransactionModule {}
