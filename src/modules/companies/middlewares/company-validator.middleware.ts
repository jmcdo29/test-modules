import {
  BadRequestException,
  NestMiddleware,
  Injectable
} from '@nestjs/common';
import { validate } from 'joi';
import { companySchema } from './../joi/company.joi';

@Injectable()
/**
 *  Company By Id Middleware edited
 *  We validating if the Id provided is valid, and returning the found companie in the variable req.company
 */
export class CompanyValidatorMiddleware implements NestMiddleware {
  constructor() {
      console.log('Company Validator is called');
  }
  async use(req, res, next: Function) {
      const result = validate(req.body, companySchema);
      if (result.error) {
          const errorMessage = result.error.details.shift().message;
          const message: string = errorMessage.replace(/["]/g, '');

          return next(new BadRequestException(`Validation failed: ${message}`));
      }
      next();
  }
}
