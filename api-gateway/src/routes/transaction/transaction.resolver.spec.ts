import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './transaction.dto';
import { Transaction } from './../../db/entities/transaction.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KafkaService } from './../../kafka/kafka.service';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let transactionService: TransactionService;
  let mockKafkaService: KafkaService;
  let mockTransactionRepository: Partial<Repository<Transaction>>;

  const mockTransaction: Transaction = {
    id: '123',
    accountExternalIdCredit: null,
    accountExternalIdDebit: null,
    accountCreditId: 'creditAccountId',
    accountDebitId: 'debitAccountId',
    value: 1000,
    transactionType: null,
    transactionTypeId: 1,
    creationDate: new Date(),
    status: null,
    statusId: 1,
  };

  const createTransactionInput: CreateTransactionInput = {
    accountExternalIdDebit: 'debitAccountId',
    accountExternalIdCredit: 'creditAccountId',
    value: 1000,
    transactionTypeId: 1,
  };

  beforeEach(async () => {
    mockTransactionRepository = {
      findOne: jest.fn().mockResolvedValue(mockTransaction),
      update: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn().mockImplementation(async () => {
              await mockKafkaService.sendMessage('someTopic', mockTransaction);
              return mockTransaction;
            }),
            getDetail: jest.fn().mockResolvedValue(mockTransaction),
            findTransaction: jest.fn().mockResolvedValue(mockTransaction),
            updateStatus: async (updatedTransaction: string) => {
              const transactionToUpdate = JSON.parse(updatedTransaction);
              await mockTransactionRepository.update(
                { id: transactionToUpdate.id },
                { statusId: transactionToUpdate.statusId },
              );
            },
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: KafkaService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
    transactionService = module.get<TransactionService>(TransactionService);
    mockKafkaService = module.get<KafkaService>(KafkaService);
  });

  describe('createTransaction', () => {
    it('should create a transaction and return it', async () => {
      const result = await resolver.createTransaction(createTransactionInput);

      expect(result).toEqual(mockTransaction);
      expect(transactionService.create).toHaveBeenCalledWith(
        createTransactionInput,
      );
      expect(mockKafkaService.sendMessage).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update transaction status', async () => {
      const updatedTransaction = JSON.stringify({ id: '123', statusId: 2 });
      await transactionService.updateStatus(updatedTransaction);

      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        { id: '123' },
        { statusId: 2 },
      );
    });
  });
});
