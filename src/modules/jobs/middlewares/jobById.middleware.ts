import {
  UnauthorizedException,
  NestMiddleware,
  Injectable,
  Inject
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Model, Types, Connection } from 'mongoose';
import { IJob } from './../interfaces/job.interface';
import { JobSchema } from './../schemas/job.schema';

import { MESSAGES, JOB_MODEL_TOKEN } from '../../../server.constants';

@Injectable()
/**
 *  Job By Id Middleware
 *  We validating if the Id provided is valid, and returning the found job in the variable req.job
 */
export class JobByIdMiddleware implements NestMiddleware {
  private jobModel;
  constructor() {
       console.log('JobByIdMiddleware');
  }
  async use(request, response, next: Function) {
       const db = request['dbConnection'];
       this.jobModel = db.model(JOB_MODEL_TOKEN, JobSchema) as Model<IJob>;

       if (!Types.ObjectId.isValid(request.params.jobId)) {
            return next(new UnauthorizedException('Invalid identifier'));
       }

       const job = await this.jobModel.findById(request.params.jobId);
       if (job) {
            request.job = job;
            next();
       } else {
            return next(new UnauthorizedException('No job with that identifier has been found'));
       }
  }
}
