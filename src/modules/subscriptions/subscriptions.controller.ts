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

import { SubscriptionsService } from './subscriptions.service';

// Guards
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('subscriptions')
@UseGuards(RolesGuard)
export class SubscriptionsController {
    constructor(@Inject(SubscriptionsService) private readonly subscriptionsService) {
    }
    /* --------------------------------------------------------------------

    Module     : Subscriptions
    Controller : Subscription Controller

    ---------------------------------------------------------------------

    Description :

    Aditional information: All role routes are working with Guards, and Guards
    are defining the current req.subscription value.

    Middleware description:

    Route:
    /api/subscriptions
    ----------------------------------------------------------------------*/

    /*
        Route:        GET api/subscriptions
        Roles:        user, admin
        Description:  Get list of subscriptions
    */

    @Get('')
    @Roles('admin')
    async list(@Req() req) {
        const subscriptions = await this.subscriptionsService.list();
        return subscriptions;
    }

    /*
        Route:        GET api/subscriptions/:subscriptionId
        Roles:        subscription, admin
        Description:  Get subscription by provided Id.
    */

    @Get(':subscriptionId')
    @Roles('admin')
    async getSubscriptionById(@Req() req) {
        const subscription = req.subscription;
        return subscription;
    }

    /*
        Route:        PUT api/subscriptions/:subscriptionId
        Roles:        subscription, admin
        Description:  Get subscription by provided Id.
    */

    @Put(':subscriptionId')
    @Roles('admin')
    async updateSubscriptionById(@Req() req) {
        const subscription = req.subscription;
        return await this.subscriptionsService.update(subscription, req.body);
    }

    /*
        Route:        DELETE api/subscriptions/:subscriptionId
        Roles:        user, admin
        Description:  Delete subscription provide by id.
    */

    @Patch(':subscriptionId')
    @Roles('admin')
    async patchSubscriptionById(@Req() req) {
        const subscription = req.subscription;
        return await this.subscriptionsService.patch(subscription, req.body);
    }

    /*
        Route:        DELETE api/subscriptions/:subscriptionId
        Roles:        user, admin
        Description:  Delete subscription provide by id.
    */

    @Delete(':subscriptionId')
    @Roles('admin')
    async deleteSubscription(@Req() req) {
        const subscription = req.subscription;
        return await this.subscriptionsService.delete(subscription);
    }
}
