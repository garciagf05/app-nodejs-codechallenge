export const transactionDetailQuery = `
  query ($transactionExternalId: String!) {
    transaction(transactionExternalId: $transactionExternalId) {
      transactionExternalId: id
      transactionType {
        name
      }
      status {
        name: description
      }
      value
      createdAt: creationDate
    }
  }
`;

export const createTransactionQuery = `
mutation($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    transactionExternalId: id
    accountExternalIdDebit { id owner }
    accountExternalIdCredit { id owner }
    transactionTypeId
    transactionType { name }
    status { description }
    value
  }
}
`;
