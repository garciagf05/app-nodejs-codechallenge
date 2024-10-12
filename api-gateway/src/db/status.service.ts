import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';

@Injectable()
export class StatusService implements OnModuleInit {
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
  ) {}

  async onModuleInit() {
    const count = await this.statusRepository.count();
    if (count === 0) {
      const statuses = [
        { id: 1, description: 'PENDING' },
        { id: 2, description: 'APPROVED' },
        { id: 3, description: 'REJECTED' },
      ];

      await this.statusRepository.save(statuses);
      console.log('Status data saved on db');
    } else {
      console.log('Status data already exists');
    }
  }
}
