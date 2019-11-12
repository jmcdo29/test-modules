import {
    Controller,
    Post,
    Get,
    Put,
    Patch,
    Delete,
    Param,
    UseGuards,
    Inject,
    Req,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { DocumentsService } from './documents.service';

// Guards
import { RolesGuard } from '../../guards/roles.guard';

import { Roles } from '../../decorators/roles.decorator';


import { MulterConfig } from '../../config/multer';

@Controller('documents')
@UseGuards(RolesGuard)
export class DocumentsController {
    constructor(@Inject(DocumentsService) private readonly documentsService) {
    }
    /* --------------------------------------------------------------------

    Module     : Documents
    Controller : Document Controller

    ---------------------------------------------------------------------

    Description :

    Aditional information: All role routes are working with Guards, and Guards
    are defining the current req.document value.

    Middleware description:

    Route:
    /api/documents
    ----------------------------------------------------------------------*/

    /*
        Route:        GET api/documents
        Roles:        user, admin
        Description:  Get list of documents
    */

    @Get('')
    @Roles('user', 'admin')
    async list(@Req() req) {
        const query = req.query;
        query.creator = req.user._id;
        const documents = await this.documentsService.list(query);
        return documents;
    }

    /*
        Route:        Post api/documents
        Roles:        user, admin
        Description:  Create a new Document
    */

    @Post('upload')
    @Roles('user', 'admin')
    @UseInterceptors(FileInterceptor('document', MulterConfig))
    async uploadDocument(@UploadedFile() file, @Req() req) {
        const document = req.body;
        document.creator = req.user._id;
        return await this.documentsService.create(document, file);
    }

    /*
        Route:        GET api/documents/:documentId
        Roles:        document, admin
        Description:  Get document by provided Id.
    */

    @Get(':documentId')
    @Roles('user', 'admin')
 
    async getDocumentById(@Req() req) {
        const document = req.document;
        return document;
    }

    /*
        Route:        PUT api/documents/:documentId
        Roles:        document, admin
        Description:  Get document by provided Id.
    */

    @Put(':documentId')
    @Roles('user', 'admin')
    async updateDocumentById(@Req() req) {
        const document = req.document;
        return await this.documentsService.update(document, req.body);
    }

    /*
        Route:        DELETE api/documents/:documentId
        Roles:        user, admin
        Description:  Delete document provide by id.
    */

    @Patch(':documentId')
    @Roles('user', 'admin')
    async patchDocumentById(@Req() req) {
        const document = req.document;
        return await this.documentsService.patch(document, req.body);
    }

    /*
        Route:        DELETE api/documents/:documentId
        Roles:        user, admin
        Description:  Delete document provide by id.
    */

    @Delete(':documentId')
    @Roles('user', 'admin')
    async deleteDocument(@Req() req) {
        const document = req.document;
        return await this.documentsService.delete(document);
    }
}
