import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/db/entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionService, TransactionResolver],
})
export class TransactionModule {}
