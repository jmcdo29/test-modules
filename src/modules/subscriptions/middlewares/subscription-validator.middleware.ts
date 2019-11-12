import {
  BadRequestException,
  NestMiddleware,
  Injectable
} from '@nestjs/common';
import { validate } from 'joi';
import { subscriptionSchema } from './../joi/subscription.joi';

@Injectable()
/**
 *  Subscription By Id Middleware edited
 *  We validating if the Id provided is valid, and returning the found subscription in the variable req.subscription
 */
export class SubscriptionValidatorMiddleware implements NestMiddleware {
  constructor() {
      console.log('Subscription Validator is called');
  }
  async use(req, res, next: Function) {
      const result = validate(req.body, subscriptionSchema);
      if (result.error) {
          const errorMessage = result.error.details.shift().message;
          const message: string = errorMessage.replace(/["]/g, '');

          return next(new BadRequestException(`Validation failed: ${message}`));
      }
      next();
  }
}
