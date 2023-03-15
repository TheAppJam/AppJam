import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { DataQueriesService } from 'src/services/data_queries.service';

@Controller('data_queries')
export class DataQueriesController {
  constructor(
    private dataQueriesService: DataQueriesService,
  ) {}

  @Get('/:id')
  async getAll(@Param('id') id) {
    const queries = await this.dataQueriesService.all(id);
    return queries
  }

  @Post()
  async create(@Body() body) {
    const {name, options, appId} = body
    const dataQuery = await this.dataQueriesService.create(
      name,
      options,
      appId,
    );
    return dataQuery
  }

  @Post(':id')
  async update(@Param('id') id, @Body() body) {
    const {options, name} = body
    const query = await this.dataQueriesService.update(
      id, name, options
    )
    return query
  }

  @Post('/preview')
  async previewQuery() {
    const result = await this.dataQueriesService.runQuery()
    return result
  }

  @Delete(':id')
  async delete(@Param() params) {
    const result = await this.dataQueriesService.delete(params.id);
    return result
  }
}
