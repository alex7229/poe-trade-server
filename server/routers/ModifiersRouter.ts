import { Server } from '../types';
import { RequestParamHandler } from 'express';

const express = require('express');
const ModifiersRouter = express.Router();

ModifiersRouter.get('/names', (req: RequestParamHandler, res: Server.ServerResponse) => {
    res.end(JSON.stringify([]));
});

export { ModifiersRouter };