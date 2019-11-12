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

import { JobsService } from './jobs.service';

// Guards
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('jobs')
@UseGuards(RolesGuard)
export class JobsController {
    constructor(@Inject(JobsService) private readonly jobsService) {
    }
    /* --------------------------------------------------------------------

    Module     : Jobs
    Controller : Job Controller

    ---------------------------------------------------------------------

    Description :

    Aditional information: All role routes are working with Guards, and Guards
    are defining the current req.job value.

    Middleware description:

    Route:
    /api/jobs
    ----------------------------------------------------------------------*/

    /*
        Route:        GET api/jobs
        Roles:        user, admin
        Description:  Get list of jobs
    */

    @Get('')
    @Roles('user', 'admin')
    async list(@Req() req) {
        const jobs = await this.jobsService.list();
        return jobs;
    }

    /*
        Route:        Post api/jobs
        Roles:        user, admin
        Description:  Create a new Job
    */

    @Post('')
    @Roles('user', 'admin')
    async create(@Req() req) {
        const job = req.body;
        job.creator = req.user._id;
        return await this.jobsService.create(job);
    }

    /*
        Route:        GET api/jobs/:jobId
        Roles:        job, admin
        Description:  Get job by provided Id.
    */

    @Get(':jobId')
    @Roles('user', 'admin')
    async getJobById(@Req() req) {
        const job = req.job;
        return job;
    }

    /*
        Route:        PUT api/jobs/:jobId
        Roles:        job, admin
        Description:  Get job by provided Id.
    */

    @Put(':jobId')
    @Roles('user', 'admin')
    async updateJobById(@Req() req) {
        const job = req.job;
        return await this.jobsService.update(job, req.body);
    }

    /*
        Route:        DELETE api/jobs/:jobId
        Roles:        user, admin
        Description:  Delete job provide by id.
    */

    @Patch(':jobId')
    @Roles('user', 'admin')
    async patchJobById(@Req() req) {
        const job = req.job;
        return await this.jobsService.patch(job, req.body);
    }

    /*
        Route:        DELETE api/jobs/:jobId
        Roles:        user, admin
        Description:  Delete job provide by id.
    */

    @Delete(':jobId')
    @Roles('user', 'admin')
    async deleteJob(@Req() req) {
        const job = req.job;
        return await this.jobsService.delete(job);
    }
}
