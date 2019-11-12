import { Controller, Get } from '@nestjs/common';

@Controller('moduleA')
export class ModuleAController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}