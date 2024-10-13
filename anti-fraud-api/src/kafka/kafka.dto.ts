export class PendingTransactionDTO {
  id: string;
  accountDebitId: string;
  accountCreditId: string;
  value: number;
  transferTypeId: number;
  statusId: number;
}
