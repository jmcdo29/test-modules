import { Controller, Get } from '@nestjs/common';

@Controller('moduleH')
export class ModuleHController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}