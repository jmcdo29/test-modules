import { Controller, Get } from '@nestjs/common';

@Controller('moduleB')
export class ModuleBController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}