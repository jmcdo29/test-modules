import {
  BadRequestException,
  NestMiddleware,
  Injectable
} from '@nestjs/common';
import { validate } from 'joi';
import { jobSchema } from './../joi/job.joi';

@Injectable()
/**
 *  Job By Id Middleware edited
 *  We validating if the Id provided is valid, and returning the found job in the variable req.job
 */
export class JobValidatorMiddleware implements NestMiddleware {
  constructor() {
      console.log('Job Validator is called');
  }
  async use(req, res, next: Function) {
      const result = validate(req.body, jobSchema);
      if (result.error) {
          const errorMessage = result.error.details.shift().message;
          const message: string = errorMessage.replace(/["]/g, '');

          return next(new BadRequestException(`Validation failed: ${message}`));
      }
      next();
  }
}
