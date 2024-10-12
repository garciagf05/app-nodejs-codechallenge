import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './transaction.dto';
import { Observable } from 'rxjs';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Observable<CreateTransactionDto> {
    return this.transactionService.createTransaction(createTransactionDto);
  }
}
