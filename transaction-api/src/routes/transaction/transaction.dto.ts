export class CreateTransactionDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}

export class TransactionCreatedDto {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  status: string;
}

export class TransactionDetailDto {
  transactionExternalId: string;
  transactionType: { name: string };
  transactionStatus: { name: string };
  value: number;
  createdAt: Date;
}

export class CreateTransactionResponseDto {
  transactionExternalId: string;
  accountExternalIdDebit: { id: string };
  accountExternalIdCredit: { id: string };
  transactionTypeId: number;
  value: number;
  status: { description: string };
}
