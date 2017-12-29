import { Server } from '../types';
import { RequestParamHandler } from 'express';
import { LatestIdRequest } from '../Requests/PoeNinja/LatestIdRequest';

const express = require('express');
const OfficialApiRouter = express.Router();

OfficialApiRouter.get('/findLatestId', (req: RequestParamHandler, res: Server.ServerResponse) => {
    const request = new LatestIdRequest();
    request.getLatestApiId()
        .then((id) => {
            res.end((JSON.stringify({id})));
        })
        .catch(err => {
            res.status(500).end(err.message);
        });
});

export { OfficialApiRouter };