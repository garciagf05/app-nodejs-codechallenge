import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AccountDto } from './account.dto';
import { getAllAccounts as getAllAccountsQuery } from './account.query';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AccountService {
  private _apiGatewayPath: string;

  constructor(private readonly httpService: HttpService) {
    this._apiGatewayPath = process.env.API_GATEWAY_PATH;
  }

  getAllAccounts(): Observable<AccountDto[]> {
    try {
      const response = this.httpService
        .post(
          `${this._apiGatewayPath}/gql`,
          { query: getAllAccountsQuery },
          { headers: { 'Content-Type': 'application/json' } },
        )
        .pipe(map(this._mapAllAccountsResponse));

      return response;
    } catch (error) {
      throw new Error(`Error creating account: ${error.message}`);
    }
  }

  private _mapAllAccountsResponse(response): AccountDto[] {
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
  }
}
