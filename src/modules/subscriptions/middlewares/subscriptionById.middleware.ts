import {
  UnauthorizedException,
  NestMiddleware,
  Injectable,
  Inject
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Model, Types, Connection } from 'mongoose';
import { ISubscription } from './../interfaces/subscription.interface';
import { SubscriptionSchema } from './../schemas/subscription.schema';

import { MESSAGES, SUBSCRIPTION_MODEL_TOKEN } from '../../../server.constants';

@Injectable()
/**
 *  Subscription By Id Middleware
 *  We validating if the Id provided is valid, and returning the found subscription in the variable req.subscription
 */
export class SubscriptionByIdMiddleware implements NestMiddleware {
  private subscriptionModel;
  constructor() {
       console.log('SubscriptionByIdMiddleware');
  }
  async use(request, response, next: Function) {
       console.log('-----------SUBSCRIPTION MIDDLEWARE IS FIRED------------');
      console.log('');
      console.log('');       
       const db = request['dbConnection'];
       this.subscriptionModel = db.model(SUBSCRIPTION_MODEL_TOKEN, SubscriptionSchema) as Model<ISubscription>;

       if (!Types.ObjectId.isValid(request.params.subscriptionId)) {
            return next(new UnauthorizedException('Invalid identifier'));
       }

       const subscription = await this.subscriptionModel.findById(request.params.subscriptionId);
       if (subscription) {
            request.subscription = subscription;
            next();
       } else {
            return next(new UnauthorizedException('No subscription with that identifier has been found'));
       }
  }
}
