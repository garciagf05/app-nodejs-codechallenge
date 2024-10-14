# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

# Tech Stack

<ol>
  <li>Node. You can use any framework you want (i.e. Nestjs with an ORM like TypeOrm or Prisma) </li>
  <li>Any database</li>
  <li>Kafka</li>    
</ol>

We do provide a `Dockerfile` to help you get started with a dev environment.

You must have two resources:

1. Resource to create a transaction that must containt:

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

2. Resource to retrieve a transaction

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": ""
  },
  "transactionStatus": {
    "name": ""
  },
  "value": 120,
  "createdAt": "Date"
}
```

## Optional

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this requirement?

You can use Graphql;

# Send us your challenge

When you finish your challenge, after forking a repository, you **must** open a pull request to our repository. There are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you feel is the most appropriate solution.

If you have any questions, please let us know.

# Solution Summary

Created 3 api/directories in a monorepository project

##transaction-api:
The interface with which the operator interacts, for this exercise its function is to activate the flow to create transactions and obtain the details of a transaction.

##api-gateway:
For data management, its main function is to manage and control operations on the data and for this it uses graphql, in addition to keeping an order on the status of the transactions with the help of Kafka

##anti-fraud-api:
Its function is to check the validity of transactions.

```sequence
transaction-api->api-gateway: http request to create a new transaction
transaction-api<-api-gateway: transaction creation confirmation
api-gateway-->antifraud-api: Kafka pending queue for transactions validations
api-gateway<--antifraud-api: Kafka validated queue for validations proccesed
transaction-api->api-gateway: http request to get transaction detail
transaction-api<-api-gateway: transaction detail response
```
###curls

- Getting Accounts
```
curl --location 'http://localhost:3000/account' \
--header 'Content-Type: application/json'
```



- Transaction Creation, you must use existing accountExternalIdDebit accountExternalIdCredit.
```
curl --location 'http://localhost:3000/transaction' \
--header 'Content-Type: application/json' \
--data '{
    "accountExternalIdDebit": "8cf2ac75-866d-41be-8f37-b2e47303edf6",
    "accountExternalIdCredit": "19b3f15a-d4e9-4bc0-8146-2fb33a475840",
    "transferTypeId": 1,
    "value": 123
  }'
```
Response example:
```json
{
    "transactionExternalId": "f890fed4-64b1-48b7-b3f4-e2f2182182c4"
    "accountExternalIdDebit": "8cf2ac75-866d-41be-8f37-b2e47303edf6",
    "accountExternalIdCredit": "19b3f15a-d4e9-4bc0-8146-2fb33a475840",
    "transferTypeId": 1,
    "value": 123
  }
```
