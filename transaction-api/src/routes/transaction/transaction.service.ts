import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateTransactionDto, TransactionCreatedDto } from './transaction.dto';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TransactionService {
  constructor(private readonly httpService: HttpService) {}

  createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Observable<TransactionCreatedDto> {
    const { API_GATEWAY_PATH } = process.env;
    const mutation = `
      mutation($input: CreateTransactionInput!) {
        createTransaction(input: $input) {
          transactionExternalId: id
          accountExternalIdDebit { id owner }
          accountExternalIdCredit { id owner }
          transferTypeId
          transferType { name }
          status { description }
          value
        }
      }
    `;

    const vars = {
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
          `${API_GATEWAY_PATH}/gql`,
          { query: mutation, variables: vars },
          { headers: { 'Content-Type': 'application/json' } },
        )
        .pipe(
          map((response) => {
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
          }),
        );

      return response;
    } catch (error) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  }
}
