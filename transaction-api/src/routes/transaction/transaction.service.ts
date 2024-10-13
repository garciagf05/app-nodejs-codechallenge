import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateTransactionDto, TransactionCreatedDto } from './transaction.dto';
import { createTransaction as createTransactionQuery } from './transaction.query';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TransactionService {
  private _apiGatewayPath: string;

  constructor(private readonly httpService: HttpService) {
    this._apiGatewayPath = process.env.API_GATEWAY_PATH;
  }

  createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Observable<TransactionCreatedDto> {
    const variables = {
      input: {
        accountExternalIdDebit: createTransactionDto.accountExternalIdDebit,
        accountExternalIdCredit: createTransactionDto.accountExternalIdCredit,
        transferTypeId: createTransactionDto.transferTypeId,
        value: createTransactionDto.value,
      },
    };

    try {
      const response = this.httpService
        .post(
          `${this._apiGatewayPath}/gql`,
          { query: createTransactionQuery, variables },
          { headers: { 'Content-Type': 'application/json' } },
        )
        .pipe(map(this._mapTransactionResponse));

      return response;
    } catch (error) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  }

  private _mapTransactionResponse(response): TransactionCreatedDto {
    const result = response.data;

    if (result.errors && result.errors.length) {
      throw new Error(
        `Error creating transaction: ${JSON.stringify(response.data.errors)}`,
      );
    }

    const transaction = result.data.createTransaction;

    return {
      transactionExternalId: transaction.transactionExternalId,
      accountExternalIdDebit: transaction.accountExternalIdDebit.id,
      accountExternalIdCredit: transaction.accountExternalIdCredit.id,
      transferTypeId: transaction.transferTypeId,
      value: transaction.value,
      status: transaction.status.id,
    };
  }
}
