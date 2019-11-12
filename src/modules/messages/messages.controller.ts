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

import { MessagesService } from './messages.service';

// Guards
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('messages')
@UseGuards(RolesGuard)
export class MessagesController {
    constructor(@Inject(MessagesService) private readonly messagesService) {
    }
    /* --------------------------------------------------------------------

    Module     : Message
    Controller : Message Controller

    ---------------------------------------------------------------------

    Description :

    Aditional information: All role routes are working with Guards, and Guards
    are defining the current req.message value.

    Middleware description:

    Route:
    /api/messages
    ----------------------------------------------------------------------*/

    /*
        Route:        GET api/messages
        Roles:        user, admin
        Description:  Get list of messages
    */

    @Get('')
    @Roles('user', 'admin')
    async list(@Req() req) {
        const messages = await this.messagesService.list();
        return messages;
    }

    /*
        Route:        Post api/messages
        Roles:        user, admin
        Description:  Create a new Message
    */

    @Post('')
    @Roles('user', 'admin')
    async create(@Req() req) {
        const message = req.body;
        message.creator = req.user._id;
        return await this.messagesService.create(message);
    }

    /*
        Route:        GET api/messages/:messageId
        Roles:        user, admin
        Description:  Get message by provided Id.
    */

    @Get(':messageId')
    @Roles('user', 'admin')
    async getMessageById(@Req() req) {
        const message = req.message;
        return message;
    }

    /*
        Route:        PUT api/messages/:messageId
        Roles:        user, admin
        Description:  Update message by provided Id.
    */

    @Put(':messageId')
    @Roles('user', 'admin')
    async updateMessageById(@Req() req) {
        const message = req.message;
        return await this.messagesService.update(message, req.body);
    }

    /*
        Route:        PATCH api/messages/:messageId
        Roles:        user, admin
        Description:  Patch message attributes by  provided Id.
    */

    @Patch(':messageId')
    @Roles('user', 'admin')
    async patchMessageById(@Req() req) {
        const message = req.message;
        return await this.messagesService.patch(message, req.body);
    }

    /*
        Route:        DELETE api/messages/:messageId
        Roles:        user, admin
        Description:  Delete message by provided id.
    */

    @Delete(':messageId')
    @Roles('user', 'admin')
    async deleteMessage(@Req() req) {
        const message = req.message;
        return await this.messagesService.delete(message);
    }
}
