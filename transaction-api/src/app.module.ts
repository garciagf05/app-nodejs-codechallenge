import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './routes/transaction/transaction.module';
import { AccountModule } from './routes/account/account.module';

@Module({
  imports: [AccountModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
