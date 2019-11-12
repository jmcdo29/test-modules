import {
  BadRequestException,
  NestMiddleware,
  Injectable
} from '@nestjs/common';
import { validate } from 'joi';
import { planSchema } from './../joi/plan.joi';

@Injectable()
/**
 *  Plan By Id Middleware edited
 *  We validating if the Id provided is valid, and returning the found plan in the variable req.plan
 */
export class PlanValidatorMiddleware implements NestMiddleware {
  constructor() {
      console.log('Plan Validator is called');
  }
  async use(req, res, next: Function) {
      const result = validate(req.body, planSchema);
      if (result.error) {
          const errorMessage = result.error.details.shift().message;
          const message: string = errorMessage.replace(/["]/g, '');

          return next(new BadRequestException(`Validation failed: ${message}`));
      }
      next();
  }
}
