import {
  BadRequestException,
  NestMiddleware,
  Injectable
} from '@nestjs/common';
import { validate } from 'joi';
import { documentSchema } from './../joi/document.joi';

@Injectable()
/**
 *  Document By Id Middleware edited
 *  We validating if the Id provided is valid, and returning the found document in the variable req.document
 */
export class DocumentValidatorMiddleware implements NestMiddleware {
  constructor() {
      console.log('Document Validator is called');
  }
  async use(req, res, next: Function) {
      const result = validate(req.body, documentSchema);
      if (result.error) {
          const errorMessage = result.error.details.shift().message;
          const message: string = errorMessage.replace(/["]/g, '');

          return next(new BadRequestException(`Validation failed: ${message}`));
      }
      next();
  }
}
