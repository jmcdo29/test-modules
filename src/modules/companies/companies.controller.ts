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
    BadRequestException,
    Req
} from '@nestjs/common';

import { CompaniesService } from './companies.service';

// Guards
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('companies')
@UseGuards(RolesGuard)
export class CompaniesController {
    constructor(@Inject(CompaniesService) private readonly companiesService) {
    }
    /* --------------------------------------------------------------------

    Module     : Company
    Controller : Company Controller

    ---------------------------------------------------------------------

    Description :

    Aditional information: All role routes are working with Guards, and Guards
    are defining the current req.companie value.

    Middleware description:

    Route:
    /api/companies
    ----------------------------------------------------------------------*/

    /*
        Route:        GET api/companies
        Roles:        user, admin
        Description:  Get list of companies
    */

    @Get('')
    @Roles('admin')
    async list(@Req() req) {
        const companies = await this.companiesService.list();
        return companies;
    }

    /*
        Route:        Post api/companies
        Roles:        user, admin
        Description:  Create a new Company
    */

    @Post('')
    @Roles('user', 'admin')
    async create(@Req() req) {
        await this.companiesService.validateEmployerUser(req.user);
        const company = req.body;
        company.creator = req.user._id;
        return await this.companiesService.create(company);
    }

    /*
        Route:        GET api/companies/:companyId
        Roles:        company, admin
        Description:  Get company by provided Id.
    */

    @Get(':companyId')
    @Roles('user', 'admin')
    async getCompanyById(@Req() req) {
        const company = req.company;
        return company;
    }

    /*
        Route:        PUT api/companies/:companyId
        Roles:        user, admin
        Description:  UPDATE company by provided Id.
    */

    @Put(':companyId')
    @Roles('user', 'admin')
    async updateCompanyById(@Req() req) {
        await this.companiesService.validateEmployerUser(req.user);
        const company = req.company;
        return await this.companiesService.update(company, req.body);
    }

    /*
        Route:        PATCH api/companies/:companyId
        Roles:        user, admin
        Description:  Patch company attributes by provided id.
    */

    @Patch(':companyId')
    @Roles('user', 'admin')
    async patchCompanyById(@Req() req) {
        await this.companiesService.validateEmployerUser(req.user);
        const company = req.company;
        return await this.companiesService.patch(company, req.body);
    }

    /*
        Route:        DELETE api/companies/:companyId
        Roles:        user, admin
        Description:  Delete companie by provided id.
    */

    @Delete(':companyId')
    @Roles('user', 'admin')
    async deleteCompany(@Req() req) {
        await this.companiesService.validateEmployerUser(req.user);
        const company = req.company;
        return await this.companiesService.delete(company);
    }


}
