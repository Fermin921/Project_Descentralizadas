import { Module } from '@nestjs/common';
import { DeployController } from './app.controller';
import { DeployService } from './app.service';

@Module({
  imports: [],
  controllers: [DeployController],
  providers: [DeployService],
})
export class AppModule {}
