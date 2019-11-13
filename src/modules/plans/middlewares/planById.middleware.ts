import {
  UnauthorizedException,
  NestMiddleware,
  Injectable,
  Inject
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Model, Types, Connection } from 'mongoose';
import { IPlan } from './../interfaces/plan.interface';
import { PlanSchema } from './../schemas/plan.schema';

import { MESSAGES, PLAN_MODEL_TOKEN } from '../../../server.constants';

@Injectable()
/**
 *  Plan By Id Middleware
 *  We validating if the Id provided is valid, and returning the found plan in the variable req.plan
 */
export class PlanByIdMiddleware implements NestMiddleware {
  private planModel;
  constructor() {
       console.log('PlanByIdMiddleware');
  }
  async use(request, response, next: Function) {
       console.log('-----------PLAN MIDDLEWARE IS FIRED------------');
      console.log('');
      console.log('');       
       const db = request['dbConnection'];
       this.planModel = db.model(PLAN_MODEL_TOKEN, PlanSchema) as Model<IPlan>;

       if (!Types.ObjectId.isValid(request.params.planId)) {
            return next(new UnauthorizedException('Invalid identifier'));
       }

       const plan = await this.planModel.findById(request.params.planId);
       if (plan) {
            request.plan = plan;
            next();
       } else {
            return next(new UnauthorizedException('No plan with that identifier has been found'));
       }
  }
}
