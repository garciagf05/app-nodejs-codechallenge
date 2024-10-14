import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { AccountDto } from './account.dto';
import { AxiosResponse } from 'axios';

describe('AccountService', () => {
  let service: AccountService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should return all accounts', async () => {
    const mockAccounts: AccountDto[] = [
      {
        id: 'f9768151-b3b5-4a46-8f69-7b3aec4b977b',
        owner: 'Name1 Lastname1',
        creationDate: new Date('2024-10-14T21:05:16.390Z'),
      },
      {
        id: 'c97f67e6-e961-440a-8fd0-b0152bea0829',
        owner: 'Name2 Lastname2',
        creationDate: new Date('2024-10-14T21:05:16.390Z'),
      },
    ];

    const mockResponse: AxiosResponse<any> = {
      data: { data: { getAllAccounts: mockAccounts } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse<any>;

    jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

    const result = await firstValueFrom(service.getAllAccounts());

    expect(result).toEqual(mockAccounts);
    expect(httpService.post).toHaveBeenCalledWith(
      expect.any(String),
      { query: expect.any(String) },
      { headers: { 'Content-Type': 'application/json' } },
    );
  });

  it('should throw an error when getting accounts fails', async () => {
    const mockError = new Error('Error getting accounts');

    jest
      .spyOn(httpService, 'post')
      .mockReturnValue(throwError(() => mockError));

    await expect(firstValueFrom(service.getAllAccounts())).rejects.toThrow(
      'Error getting accounts',
    );
  });
});
