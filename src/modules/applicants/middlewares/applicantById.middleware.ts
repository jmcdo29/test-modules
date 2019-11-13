import {
  UnauthorizedException,
  NestMiddleware,
  Injectable,
  Inject
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Model, Types, Connection } from 'mongoose';
import { IApplicant } from './../interfaces/applicant.interface';
import { ApplicantSchema } from './../schemas/applicant.schema';

import { MESSAGES, APPLICANT_MODEL_TOKEN } from '../../../server.constants';

@Injectable()
/**
 *  Applicant By Id Middleware
 *  We validating if the Id provided is valid, and returning the found applicant in the variable req.applicant
 */
export class ApplicantByIdMiddleware implements NestMiddleware {
  private applicantModel;
  constructor() {
       console.log('ApplicantByIdMiddleware');
  }
  async use(request, response, next: Function) {
      console.log('-----------APPLICANT MIDDLEWARE IS FIRED------------');
      console.log('');
      console.log('');
      const db = request['dbConnection'];
       this.applicantModel = db.model(APPLICANT_MODEL_TOKEN, ApplicantSchema) as Model<IApplicant>;

       if (!Types.ObjectId.isValid(request.params.applicantId)) {
            return next(new UnauthorizedException('Invalid identifier'));
       }

       const applicant = await this.applicantModel.findById(request.params.applicantId);
       if (applicant) {
            request.applicant = applicant;
            next();
       } else {
            return next(new UnauthorizedException('No applicant with that identifier has been found'));
       }
  }
}
