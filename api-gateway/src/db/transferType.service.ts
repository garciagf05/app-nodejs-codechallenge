import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferType } from './entities/transferType.entity';

@Injectable()
export class TransferTypeService implements OnModuleInit {
  constructor(
    @InjectRepository(TransferType)
    private transferTypeRepository: Repository<TransferType>,
  ) {}

  async onModuleInit() {
    const count = await this.transferTypeRepository.count();
    if (count === 0) {
      const transferTypes = [
        { id: 1, name: 'debit' },
        { id: 2, name: 'credit' },
      ];

      await this.transferTypeRepository.save(transferTypes);
      console.log('TransferType data saved on db');
    } else {
      console.log('TransferType data already exists');
    }
  }
}
