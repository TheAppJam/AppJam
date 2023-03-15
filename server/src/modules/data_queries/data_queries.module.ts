import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataQueriesController } from 'src/controllers/data_queries/data_queries.controller';
import { DataQueriesService } from 'src/services/data_queries.service';
import {DataQuery} from 'src/entities/data_query.entity';


@Module({
  imports: [TypeOrmModule.forFeature([
    DataQuery
  ])],
  controllers: [DataQueriesController],
  providers: [DataQueriesService]
})
export class DataQueriesModule {}
