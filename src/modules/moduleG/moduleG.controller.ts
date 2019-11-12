import { Controller, Get } from '@nestjs/common';

@Controller('moduleG')
export class ModuleGController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}