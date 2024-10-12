import { Resolver, Query } from '@nestjs/graphql';
import { AccountService } from './account.service';
import { Account } from 'src/db/entities/account.entity';

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => [Account])
  async getAllAccounts(): Promise<Account[]> {
    return await this.accountService.getAllAccounts();
  }
}
