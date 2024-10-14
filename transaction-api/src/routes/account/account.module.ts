import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AccountController } from './account.controller';
import { AccountService } from './/account.service';

@Module({
  imports: [HttpModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
