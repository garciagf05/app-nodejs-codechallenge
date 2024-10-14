import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from './entities/transactionType.entity';

@Injectable()
export class TransactionTypeService implements OnModuleInit {
  constructor(
    @InjectRepository(TransactionType)
    private transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async onModuleInit() {
    const count = await this.transactionTypeRepository.count();
    if (count === 0) {
      const transactionTypes = [
        { id: 1, name: 'debit' },
        { id: 2, name: 'credit' },
      ];

      await this.transactionTypeRepository.save(transactionTypes);
      console.log('TransactionType data saved on db');
    } else {
      console.log('TransactionType data already exists');
    }
  }
}
