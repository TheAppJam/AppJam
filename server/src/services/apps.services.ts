import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { App } from 'src/entities/app.entity';
import {DataQuery} from 'src/entities/data_query.entity';
import { getTemplate, buildApp } from 'src/helpers/utils.helper';
import { Repository } from 'typeorm';

@Injectable()
export class AppsService {
  constructor(
    @InjectRepository(App)
    private appsRepository: Repository<App>,

    @InjectRepository(DataQuery)
    private dataQueriesRepository: Repository<DataQuery>
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async create(user): Promise<App> {
    const app = await this.appsRepository.save(
      this.appsRepository.create({
        userId: user.id,
        order: {},
        definition: {},
        settings: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    )

    return app
  }

  async delete(appId) {
    await this.appsRepository.delete(appId)
  }

  async updateApp(id, body): Promise<any> {
    await this.appsRepository.update(id, {
      order: body.order,
    })
    const app = await this.appsRepository.findOne({where: {id}})
    return app
  }

  async updateAppDefinition(id, body): Promise<any> {
    await this.appsRepository.update(id, {
      definition: body.definition
    })
    const app = await this.appsRepository.findOne({where: {id}})
    return app
  }

  async updateAppSetting(id, body): Promise<any> {
    await this.appsRepository.update(id, {
      settings: body.settings
    })
    const app = await this.appsRepository.findOne({where: {id}})
    return app
  }

  async getApp(id): Promise<App>{
    const app = await this.appsRepository.findOne({where: {id}})
    return app
  }

  async handleBuildApp(id){
    const app = await this.appsRepository.findOne({where: {id}})
    const dataQueries = await this.dataQueriesRepository.find({where: {appId: id}, order: {createdAt: 'DESC'}})
    app['data_queries'] = dataQueries
    const config = app
    buildApp(config)
  }

  async previewApp(id): Promise<string>{
    const app = await this.appsRepository.findOne({where: {id}})
    const dataQueries = await this.dataQueriesRepository.find({where: {appId: id}, order: {createdAt: 'DESC'}})
    app['data_queries'] = dataQueries
    const config = app
    const template = getTemplate(config)
    return template
  }

  async findDataQueriesForApp(appId) {
    return await this.dataQueriesRepository.find({where: {appId}, order: { createdAt: 'DESC' }})
  }

  async getAll(user) {
    return await this.appsRepository.find({where: {userId: user.id}, order: { createdAt: 'DESC'}})
  }
}
