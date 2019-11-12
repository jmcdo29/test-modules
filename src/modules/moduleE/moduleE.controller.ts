import { Controller, Get } from '@nestjs/common';

@Controller('moduleE')
export class ModuleEController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}