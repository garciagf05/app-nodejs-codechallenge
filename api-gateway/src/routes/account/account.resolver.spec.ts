import { Test, TestingModule } from '@nestjs/testing';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

describe('AccountResolver', () => {
  let resolver: AccountResolver;
  let service: AccountService;

  const mockAccountService = {
    getAllAccounts: jest.fn().mockResolvedValue([
      {
        id: 'f9768151-b3b5-4a46-8f69-7b3aec4b977b',
        owner: 'FirstName1 LastName1',
        creationDate: new Date('2024-10-14T21:05:16.390Z'),
      },
      {
        id: 'c97f67e6-e961-440a-8fd0-b0152bea0829',
        owner: 'FirstName2 LastName2',
        creationDate: new Date('2024-10-14T21:05:16.390Z'),
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountResolver,
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
      ],
    }).compile();

    resolver = module.get<AccountResolver>(AccountResolver);
    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAllAccounts', () => {
    it('should return an array of accounts', async () => {
      const result = await resolver.getAllAccounts();
      expect(result).toEqual([
        {
          id: 'f9768151-b3b5-4a46-8f69-7b3aec4b977b',
          owner: 'FirstName1 LastName1',
          creationDate: new Date('2024-10-14T21:05:16.390Z'),
        },
        {
          id: 'c97f67e6-e961-440a-8fd0-b0152bea0829',
          owner: 'FirstName2 LastName2',
          creationDate: new Date('2024-10-14T21:05:16.390Z'),
        },
      ]);
      expect(service.getAllAccounts).toHaveBeenCalled();
    });
  });
});
