import { Controller, Get } from '@nestjs/common';

@Controller('moduleC')
export class ModuleCController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}