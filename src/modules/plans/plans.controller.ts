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

import { PlansService } from './plans.service';

// Guards
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('plans')
@UseGuards(RolesGuard)
export class PlansController {
    constructor(@Inject(PlansService) private readonly plansService) {
    }
    /* --------------------------------------------------------------------

    Module     : Plans
    Controller : Plan Controller

    ---------------------------------------------------------------------

    Description :

    Aditional information: All role routes are working with Guards, and Guards
    are defining the current req.plan value.

    Middleware description:

    Route:
    /api/plans
    ----------------------------------------------------------------------*/

    /*
        Route:        GET api/plans
        Roles:        user, admin
        Description:  Get list of plans
    */

    @Get('')
    @Roles('admin')
    async list(@Req() req) {
        const plans = await this.plansService.list();
        return plans;
    }

    /*
        Route:        Post api/plans
        Roles:        user, admin
        Description:  Create a new Plan
    */

    @Post('')
    @Roles('admin')
    async create(@Req() req) {
        const plan = req.body;
        plan.creator = req.user._id;
        return await this.plansService.create(plan);
    }

    /*
        Route:        GET api/plans/:planId
        Roles:        plan, admin
        Description:  Get plan by provided Id.
    */

    @Get(':planId')
    @Roles('admin')
    async getPlanById(@Req() req) {
        const plan = req.plan;
        return plan;
    }

    /*
        Route:        PUT api/plans/:planId
        Roles:        plan, admin
        Description:  Get plan by provided Id.
    */

    @Put(':planId')
    @Roles('admin')
    async updatePlanById(@Req() req) {
        const plan = req.plan;
        return await this.plansService.update(plan, req.body);
    }

    /*
        Route:        DELETE api/plans/:planId
        Roles:        user, admin
        Description:  Delete plan provide by id.
    */

    @Patch(':planId')
    @Roles('user', 'admin')
    async patchPlanById(@Req() req) {
        const plan = req.plan;
        return await this.plansService.patch(plan, req.body);
    }

    /*
        Route:        DELETE api/plans/:planId
        Roles:        user, admin
        Description:  Delete plan provide by id.
    */

    @Delete(':planId')
    @Roles('admin')
    async deletePlan(@Req() req) {
        const plan = req.plan;
        return await this.plansService.delete(plan);
    }
}
