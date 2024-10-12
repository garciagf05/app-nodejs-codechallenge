import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Account } from './db/entities/account.entity';
import { Status } from './db/entities/status.entity';
import { Transaction } from './db/entities/transaction.entity';
import { TransferType } from './db/entities/transferType.entity';
import { AccountModule } from './routes/account/account.module';
import { TransactionModule } from './routes/transaction/transaction.module';
import { StatusService } from './db/status.service';
import { TransferTypeService } from './db/transferType.service';
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
      host: POSTGRES_HOST || 'localhost',
      port: parseInt(POSTGRES_PORT) || 5432,
      username: POSTGRES_USER || 'postgres',
      password: POSTGRES_PASSWORD || 'postgres',
      database: POSTGRES_DB || 'postgres',
      entities: [Account, Status, Transaction, TransferType],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Status, TransferType]),
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
  providers: [AppService, StatusService, TransferTypeService],
})
export class AppModule {}
