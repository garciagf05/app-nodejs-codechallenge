import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountServiceDB implements OnModuleInit {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async onModuleInit() {
    const count = await this.accountRepository.count();
    if (count === 0) {
      const accounts = [
        { owner: 'Pedro Perez', creationDate: new Date() },
        { owner: 'Rodrigo Rodriguez', creationDate: new Date() },
        { owner: 'Gonzalo Gonzalez', creationDate: new Date() },
        { owner: 'Lara Lara', creationDate: new Date() },
        { owner: 'Alba Alba', creationDate: new Date() },
        { owner: 'Afonso Alonso', creationDate: new Date() },
        { owner: 'Ray Reyes', creationDate: new Date() },
        { owner: 'John Johnson', creationDate: new Date() },
        { owner: 'Jamie Jamieson', creationDate: new Date() },
        { owner: 'Peter Parker', creationDate: new Date() },
        { owner: 'Richard Richards', creationDate: new Date() },
      ];

      await this.accountRepository.save(accounts);
      console.log('Account data saved on db');
    } else {
      console.log('Account data already exists');
    }
  }
}
