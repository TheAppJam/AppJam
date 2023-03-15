import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import got from 'got';
import {DataQuery} from 'src/entities/data_query.entity';

@Injectable()
export class DataQueriesService {

  constructor(
    @InjectRepository(DataQuery)
    private dataQueriesRepository: Repository<DataQuery>
  ) {}

  async runQuery() {
    const response = await got('https://mocki.io/v1/08cb79f0-46e7-418a-800f-01d493866a4e', {method: 'GET'})
    const result = JSON.parse(response.body)
    console.log(result)
    return {
      data: result
    }
  }

  async create(
    name: string,
    options: object,
    appId: string,
  ) {
    const newDataQuery = this.dataQueriesRepository.create({
      appId,
      options,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return this.dataQueriesRepository.save(newDataQuery);
  }

  async update(id, name, options) {
    await this.dataQueriesRepository.update(id, {
      name: name,
      options: options
    })

    const query = this.dataQueriesRepository.findOne({where: {id}})
    return query
  }

  async all(appId) {
    return await this.dataQueriesRepository.find({where: {appId}, order: { createdAt: 'DESC' }})
  }

  async delete(dataQueryId: string) {
    return await this.dataQueriesRepository.delete(dataQueryId);
  }

}