import {
  UnauthorizedException,
  NestMiddleware,
  Injectable,
  Inject
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Model, Types, Connection } from 'mongoose';
import { ICompany } from './../interfaces/company.interface';
import { CompanySchema } from './../schemas/company.schema';

import { MESSAGES, COMPANY_MODEL_TOKEN } from '../../../server.constants';

@Injectable()
/**
 *  Company By Id Middleware
 *  We validating if the Id provided is valid, and returning the found companie in the variable req.company
 */
export class CompanyByIdMiddleware implements NestMiddleware {
  private companyModel;
  constructor() {
       console.log('CompanyByIdMiddleware');
  }
  async use(request, response, next: Function) {
       console.log('-----------COMPANY MIDDLEWARE IS FIRED------------');
      console.log('');
      console.log('');       
       const db = request['dbConnection'];
       this.companyModel = db.model(COMPANY_MODEL_TOKEN, CompanySchema) as Model<ICompany>;

       if (!Types.ObjectId.isValid(request.params.companyId)) {
            return next(new UnauthorizedException('Invalid identifier'));
       }

       const company = await this.companyModel.findById(request.params.companyId);
       if (company) {
            request.company = company;
            next();
       } else {
            return next(new UnauthorizedException('No company with that identifier has been found'));
       }
  }
}
