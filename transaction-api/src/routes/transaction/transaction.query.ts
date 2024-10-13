export const createTransaction = `
mutation($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    transactionExternalId: id
    accountExternalIdDebit { id owner }
    accountExternalIdCredit { id owner }
    transferTypeId
    transferType { name }
    status { description }
    value
  }
}
`;
