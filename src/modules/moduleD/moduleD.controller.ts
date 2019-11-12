import { Controller, Get } from '@nestjs/common';

@Controller('moduleD')
export class ModuleDController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}