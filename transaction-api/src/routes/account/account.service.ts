import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AccountDto } from './account.dto';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AccountService {
  constructor(private readonly httpService: HttpService) {}

  getAllAccounts(): Observable<AccountDto[]> {
    const { API_GATEWAY_PATH } = process.env;
    const query = `
      query {
        getAllAccounts {
          id
          owner
          creationDate
        }
      }
    `;

    try {
      const response = this.httpService
        .post(
          `${API_GATEWAY_PATH}/gql`,
          { query },
          { headers: { 'Content-Type': 'application/json' } },
        )
        .pipe(
          map((response) => {
            const result = response.data;

            if (result.errors && result.errors.length) {
              throw new Error(
                `Error creating account: ${JSON.stringify(response.data.errors)}`,
              );
            }

            return result.data.getAllAccounts.map((data: AccountDto) => {
              return {
                id: data.id,
                owner: data.owner,
                creationDate: data.creationDate,
              };
            });
          }),
        );

      return response;
    } catch (error) {
      throw new Error(`Error creating account: ${error.message}`);
    }
  }
}
