import { Controller, Get } from '@nestjs/common';

@Controller('moduleF')
export class ModuleFController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}