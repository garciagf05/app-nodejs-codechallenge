import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Account } from './db/entities/account.entity';
import { Status } from './db/entities/status.entity';
import { Transaction } from './db/entities/transaction.entity';
import { TransactionType } from './db/entities/transactionType.entity';
import { AccountModule } from './routes/account/account.module';
import { TransactionModule } from './routes/transaction/transaction.module';
import { StatusService } from './db/status.service';
import { TransactionTypeService } from './db/transactionType.service';
import { join } from 'path';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: parseInt(POSTGRES_PORT),
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [Account, Status, Transaction, TransactionType],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Status, TransactionType]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      path: '/gql',
      sortSchema: true,
      playground: false,
    }),
    AccountModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, StatusService, TransactionTypeService],
})
export class AppModule {}
