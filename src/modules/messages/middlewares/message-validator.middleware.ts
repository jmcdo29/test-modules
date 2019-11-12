import {
  BadRequestException,
  NestMiddleware,
  Injectable
} from '@nestjs/common';
import { validate } from 'joi';
import { messageSchema } from './../joi/message.joi';

@Injectable()
/**
 *  Message By Id Middleware edited
 *  We validating if the Id provided is valid, and returning the found message in the variable req.message
 */
export class MessageValidatorMiddleware implements NestMiddleware {
  constructor() {
      console.log('Message Validator is called');
  }
  async use(req, res, next: Function) {
      const result = validate(req.body, messageSchema);
      if (result.error) {
          const errorMessage = result.error.details.shift().message;
          const message: string = errorMessage.replace(/["]/g, '');

          return next(new BadRequestException(`Validation failed: ${message}`));
      }
      next();
  }
}
