import { Controller, Get } from '@nestjs/common';
import { DeployService } from './app.service';

@Controller('deploy')
export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @Get()
  async deployContracts() {
    return this.deployService.deployContracts();
  }
}
