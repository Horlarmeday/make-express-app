/* eslint-disable import/first */
import '../config/env';
import express from 'express';
import error from '../middleware/error';
import loaders from './loaders';
import routes from './routes';
import './logger';
import './database';
import './objectIdvalidation';

const server = express();
loaders(server, express);
routes(server);



server.use(error);

export default server;
