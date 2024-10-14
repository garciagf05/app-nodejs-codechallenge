import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, TransactionCreatedDto } from './transaction.dto';
import { Observable } from 'rxjs';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':transactionExternalId')
  async getTransactionDetails(
    @Param('transactionExternalId') transactionExternalId: string,
  ) {
    return this.transactionService.getTransactionDetails(transactionExternalId);
  }

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Observable<TransactionCreatedDto> {
    return this.transactionService.createTransaction(createTransactionDto);
  }
}
