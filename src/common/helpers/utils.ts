import { EnvironmentService } from '../../environment.variables';
import { DB_PREFIX } from '../../server.constants';
import { white, red, yellow, green, gray, blue } from 'chalk';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as url from 'url';
const URL = url.URL;

/**
 * Defines if the provided parameter is an empty object {} or not
 */
function isEmptyObject(value) {
    for (const key in value) {
        if (value.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function getMethodColor(method) {
    let color;
    switch (method) {
        case 'POST':
            color = yellow;
            break;
        case 'GET':
            color = green;
            break;
        case 'PUT':
            color = blue;
            break;
        case 'PATCH':
            color = gray;
            break;
        case 'DELETE':
            color = red;
            break;
    }
    return color;
}

function getAllowedDatabases() {
    const environment = new EnvironmentService('.env');
    const allowedDbs = environment.get('DBS').split(',');
    return allowedDbs;
}

const getOrigin = url => {
    if (url) {
        const newURL = new URL(url);
        return newURL.host;
    } else {
        return null;
    }
};

const getDatabaseFromOrigin = headers => {
    //  El req.headers.origin de postman es undefined, hay que filtrar que otras conexiones no lleguen aqui.
    const origin = getOrigin(headers.origin);
    if (origin) {
        const subdomainDB = origin.split('.')[0].toLowerCase();
        const allowedDbs = getAllowedDatabases();
        const isValidSubdomain = allowedDbs.includes(`${DB_PREFIX}-${subdomainDB}`);
        if (isValidSubdomain) {
            return `${DB_PREFIX}-${subdomainDB}`;
        } else {
            return `${DB_PREFIX}-local`;
        }
        return `${DB_PREFIX}-${subdomainDB}`;
    } else {
        return `${DB_PREFIX}-local`;
    }
};

const returnExtensionByMime = (mimeType: string): string => {
    switch(mimeType) {
        case 'text/csv':
            return 'csv';
        break;
        case 'image/gif':
            return 'gif';
        break;
        case 'image/jpeg':
            return 'jpg';
        break;
        case 'image/png':
            return 'png';
        break;
        case 'application/javascript':
            return 'js';
        break;
        case 'video/mpeg':
            return 'mpeg';
        break;
        case 'application/pdf':
            return 'pdf';
        break;
        case 'application/xhtml+xml':
            return 'xhtml';
        break;
        case 'application/vnd.ms-excel':
            return 'xls';
        break;
        case 'application/xml':
            return 'xml';
        break;
        case 'application/zip':
            return 'zip';
        break;
        case 'application/x-7z-compressed':
            return '7z';
        break;
    }
};

const isUserOwner = (user, model) => {
    const creatorId = model.creator._id || model.creator;
    const userId = user._id.toString();
    if (creatorId.toString() !== userId) {
        throw new HttpException('You must be the creator', HttpStatus.FORBIDDEN);        
    }
};

export {
    isEmptyObject,
    getMethodColor,
    getOrigin,
    getDatabaseFromOrigin,
    returnExtensionByMime,
    isUserOwner
};
