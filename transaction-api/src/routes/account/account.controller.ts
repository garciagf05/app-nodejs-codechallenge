import { Controller, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './account.dto';
import { Observable } from 'rxjs';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  getAll(): Observable<AccountDto[]> {
    return this.accountService.getAllAccounts();
  }
}
