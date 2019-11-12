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
    Req
} from '@nestjs/common';

import { ApplicantsService } from './applicants.service';

// Guards
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('applicants')
@UseGuards(RolesGuard)
export class ApplicantsController {
    constructor(@Inject(ApplicantsService) private readonly applicantsService) {
    }
    /* --------------------------------------------------------------------

    Module     : Applicant
    Controller : Applicant Controller

    ---------------------------------------------------------------------

    Description :

    Aditional information: All role routes are working with Guards, and Guards
    are defining the current req.applicant value.

    Middleware description:

    Route:
    /api/applicants
    ----------------------------------------------------------------------*/

    /*
        Route:        GET api/applicants
        Roles:        user, admin
        Description:  Get list of applicants
    */

    @Get('')
    @Roles('user', 'admin')
    async list(@Req() req) {
        const applicants = await this.applicantsService.list();
        return applicants;
    }

    /*
        Route:        Post api/applicants
        Roles:        user, admin
        Description:  Create a new Applicant
    */

    @Post('')
    @Roles('user', 'admin')
    async create(@Req() req) {
        const applicant = req.body;
        applicant.creator = req.user._id;
        return await this.applicantsService.create(applicant);
    }

    /*
        Route:        GET api/applicants/:applicantId
        Roles:        user, admin
        Description:  Get applicant by provided Id.
    */

    @Get(':applicantId')
    @Roles('user', 'admin')
    async getApplicantById(@Req() req) {
        const applicant = req.applicant;
        return applicant;
    }

    /*
        Route:        PUT api/applicants/:applicantId
        Roles:        user, admin
        Description:  Update applicant by provided Id.
    */

    @Put(':applicantId')
    @Roles('user', 'admin')
    async updateApplicantById(@Req() req) {
        const applicant = req.applicant;
        return await this.applicantsService.update(applicant, req.body);
    }

    /*
        Route:        PATCH api/applicants/:applicantId
        Roles:        user, admin
        Description:  Patch applicant attributes by  provided Id.
    */

    @Patch(':applicantId')
    @Roles('user', 'admin')
    async patchApplicantById(@Req() req) {
        const applicant = req.applicant;
        return await this.applicantsService.patch(applicant, req.body);
    }

    /*
        Route:        DELETE api/applicants/:applicantId
        Roles:        user, admin
        Description:  Delete applicant by provided id.
    */

    @Delete(':applicantId')
    @Roles('user', 'admin')
    async deleteApplicant(@Req() req) {
        const applicant = req.applicant;
        return await this.applicantsService.delete(applicant);
    }
}
