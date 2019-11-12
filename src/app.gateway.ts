import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayInit,
} from '@nestjs/websockets';

import { Injectable, Inject } from '@nestjs/common';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

import { getSocketServer, setSocketServer } from './common/helpers/websockets';

@WebSocketGateway()

@Injectable()
export class AppGateway implements OnGatewayInit {
    @WebSocketServer() server: Server;

    constructor() {
        console.log('Initializing Socket');
        console.log('Para utilizar est socket solo es necesario declararlo en providers e inyectarlo en el controlador/servicio');
    }

    afterInit() {
        if (!getSocketServer()) {
            setSocketServer(this.server);
            this.server['authenticatedUsers'] = [];
            console.log('Connectando a Socket');
            this.server.sockets.on('connection', function(socket) {
                this.server.authenticatedUsers.push({ time: 1 });
                console.log('User Connected');
            });            
        } else {
            console.log('-------------------------------------------------------')
            console.log('SOCKET IS SETUP, WE DON');
        }

        //  En cada conexión al servidor, ésta linea guardará a los usuarios

    }

    modelCreationSocket(model, data) {
        this.server = getSocketServer();
        //  Este socket puede llamarse cada vez que se crea un nuevo modelo
        return this.server.emit(`${model}Channel`, data);
    }
}
