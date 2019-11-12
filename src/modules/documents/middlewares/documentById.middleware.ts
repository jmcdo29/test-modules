import {
  UnauthorizedException,
  NestMiddleware,
  Injectable,
  Inject
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Model, Types, Connection } from 'mongoose';
import { IDocument } from './../interfaces/document.interface';
import { DocumentSchema } from './../schemas/document.schema';

import { MESSAGES, DOCUMENT_MODEL_TOKEN } from '../../../server.constants';

@Injectable()
/**
 *  Document By Id Middleware
 *  We validating if the Id provided is valid, and returning the found document in the variable req.document
 */
export class DocumentByIdMiddleware implements NestMiddleware {
  private documentModel;
  constructor() {
       console.log('DocumentByIdMiddleware');
  }
  async use(request, response, next: Function) {
       const db = request['dbConnection'];
       this.documentModel = db.model(DOCUMENT_MODEL_TOKEN, DocumentSchema) as Model<IDocument>;

        const allowedRoutes = ['upload'];
        const isAllowedRoute = (allowedRoutes.indexOf(request.params.documentId) > -1);

        if (isAllowedRoute) {
            return next();
        } else if (!Types.ObjectId.isValid(request.params.documentId)) {
            return next(new UnauthorizedException('Invalid identifier'));
        }

        const document = await this.documentModel.findById(request.params.documentId);
        if (document) {
            request.document = document;
            next();
        } else {
            return next(new UnauthorizedException('No document with that identifier has been found'));
        }
  }
}
