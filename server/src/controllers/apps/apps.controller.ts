import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { AppsService } from 'src/services/apps.services';
import { AuthService } from 'src/services/auth.servcies';

@Controller('apps')
export class AppsController {
  constructor(
    private appsService: AppsService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAll(@User() user) {
    let apps = [];
    apps = await this.appsService.getAll(user);
    return apps;
  }

  @Get('/build/:id')
  buildApp(@Param('id') id) {
    this.appsService.handleBuildApp(id);
  }

  @Get('/preview/:id')
  previewApp(@Param('id') id){
    const app = this.appsService.previewApp(id);
    return app;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@User() user) {
    const app = await this.appsService.create(user);
    return app;
  }

  @Delete(':id')
  async delete(@Param() params) {
    const result = await this.appsService.delete(params.id);
    return result
  }

  @Put(':id')
  async updateApp(@Param('id') id, @Body() body) {
    const app = await this.appsService.updateApp(id, body);
    return app;
  }

  @Put('/definition/:id')
  async upadteAppDefinition(@Param('id') id, @Body() body) {
    const app = await this.appsService.updateAppDefinition(id, body);
    return app;
  }

  @Put('/settings/:id')
  async updateAppSettings(@Param('id') id, @Body() body) {
    const app = await this.appsService.updateAppSetting(id, body);
    return app
  }

  @Get(':id')
  async getApp(@Param('id') id) {
    const app = await this.appsService.getApp(id);
    const dataQueries = await this.appsService.findDataQueriesForApp(id);
    app['data_queries'] = dataQueries;
    return app;
  }
}
