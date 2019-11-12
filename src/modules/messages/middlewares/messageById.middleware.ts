import {
  UnauthorizedException,
  NestMiddleware,
  Injectable,
  Inject
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Model, Types, Connection } from 'mongoose';
import { IMessage } from './../interfaces/message.interface';
import { MessageSchema } from './../schemas/message.schema';

import { MESSAGES, MESSAGE_MODEL_TOKEN } from '../../../server.constants';

@Injectable()
/**
 *  Message By Id Middleware
 *  We validating if the Id provided is valid, and returning the found message in the variable req.message
 */
export class MessageByIdMiddleware implements NestMiddleware {
  private messageModel;
  constructor() {
       console.log('MessageByIdMiddleware');
  }
  async use(request, response, next: Function) {
       const db = request['dbConnection'];
       this.messageModel = db.model(MESSAGE_MODEL_TOKEN, MessageSchema) as Model<IMessage>;

       if (!Types.ObjectId.isValid(request.params.messageId)) {
            return next(new UnauthorizedException('Invalid identifier'));
       }

       const message = await this.messageModel.findById(request.params.messageId);
       if (message) {
            request.message = message;
            next();
       } else {
            return next(new UnauthorizedException('No message with that identifier has been found'));
       }
  }
}
