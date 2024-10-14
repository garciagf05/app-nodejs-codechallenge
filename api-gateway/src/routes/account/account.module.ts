import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './../../db/entities/account.entity';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';
import { AccountServiceDB } from 'src/db/account.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountService, AccountServiceDB, AccountResolver],
})
export class AccountModule {}
