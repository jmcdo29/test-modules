import {
  BadRequestException,
  NestMiddleware,
  Injectable
} from '@nestjs/common';
import { validate } from 'joi';
import { applicantSchema } from './../joi/applicant.joi';

@Injectable()
/**
 *  Applicant By Id Middleware edited
 *  We validating if the Id provided is valid, and returning the found applicant in the variable req.applicant
 */
export class ApplicantValidatorMiddleware implements NestMiddleware {
  constructor() {
      console.log('Applicant Validator is called');
  }
  async use(req, res, next: Function) {
      const result = validate(req.body, applicantSchema);
      if (result.error) {
          const errorMessage = result.error.details.shift().message;
          const message: string = errorMessage.replace(/["]/g, '');

          return next(new BadRequestException(`Validation failed: ${message}`));
      }
      next();
  }
}
