export class PendingTransactionDTO {
  id: string;
  value: number;
  statusId: number;
}

export class ValidatedTransactionDTO {
  id: string;
  value: number;
  statusId: number;
}

export class StatusDTO {
  APPROVED: number;
  REJECTED: number;
}
