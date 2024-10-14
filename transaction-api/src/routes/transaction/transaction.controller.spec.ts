import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import {
  CreateTransactionDto,
  CreateTransactionResponseDto,
  TransactionCreatedDto,
  TransactionDetailDto,
} from './transaction.dto';
import {
  transactionDetailQuery,
  createTransactionQuery,
} from './transaction.query';
import { AxiosResponse } from 'axios';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should return transaction details', async () => {
    const mockTransactionDetail: TransactionDetailDto = {
      transactionExternalId: '1',
      transactionType: { name: 'debit' },
      transactionStatus: { name: 'APPROVED' },
      value: 1000,
      createdAt: new Date(),
    };

    const mockResponse: AxiosResponse<any> = {
      data: { data: { transaction: mockTransactionDetail } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse<any>;

    jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

    const result = await firstValueFrom(service.getTransactionDetails('1'));

    expect(result).toEqual(mockTransactionDetail);
    expect(httpService.post).toHaveBeenCalledWith(
      expect.any(String),
      {
        query: transactionDetailQuery,
        variables: { transactionExternalId: '1' },
      },
      { headers: { 'Content-Type': 'application/json' } },
    );
  });

  it('should throw an error when getting transaction details fails', async () => {
    const mockError = new Error('Error getting transaction');

    jest
      .spyOn(httpService, 'post')
      .mockReturnValue(throwError(() => mockError));

    await expect(
      firstValueFrom(service.getTransactionDetails('1')),
    ).rejects.toThrow('Error getting transaction');
  });

  it('should create a transaction', async () => {
    const mockTransactionCreated: TransactionCreatedDto = {
      transactionExternalId: '1',
      accountExternalIdDebit: 'account-debit-id',
      accountExternalIdCredit: 'account-credit-id',
      transferTypeId: 1,
      value: 1000,
      status: 'PENDING',
    };

    const createTransactionDto: CreateTransactionDto = {
      accountExternalIdDebit: 'account-debit-id',
      accountExternalIdCredit: 'account-credit-id',
      transferTypeId: 1,
      value: 100,
    };

    const createTransactionGql = {
      accountExternalIdDebit: 'account-debit-id',
      accountExternalIdCredit: 'account-credit-id',
      transactionTypeId: 1,
      value: 100,
    };

    const createTransactionResponse: CreateTransactionResponseDto = {
      transactionExternalId: '1',
      accountExternalIdDebit: { id: 'account-debit-id' },
      accountExternalIdCredit: { id: 'account-credit-id' },
      transactionTypeId: 1,
      value: 1000,
      status: { description: 'PENDING' },
    };

    const mockResponse: AxiosResponse<any> = {
      data: { data: { createTransaction: createTransactionResponse } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse<any>;

    jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

    const result = await firstValueFrom(
      service.createTransaction(createTransactionDto),
    );

    expect(result).toEqual(mockTransactionCreated);
    expect(httpService.post).toHaveBeenCalledWith(
      expect.any(String),
      {
        query: createTransactionQuery,
        variables: { input: createTransactionGql },
      },
      { headers: { 'Content-Type': 'application/json' } },
    );
  });

  it('should throw an error when creating a transaction fails', async () => {
    const createTransactionDto: CreateTransactionDto = {
      accountExternalIdDebit: 'account-debit-id',
      accountExternalIdCredit: 'account-credit-id',
      transferTypeId: 1,
      value: 100,
    };

    const mockError = new Error('Error creating transaction');

    jest
      .spyOn(httpService, 'post')
      .mockReturnValue(throwError(() => mockError));

    await expect(
      firstValueFrom(service.createTransaction(createTransactionDto)),
    ).rejects.toThrow('Error creating transaction');
  });
});
