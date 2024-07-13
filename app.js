import express from 'express';
import morgan from 'morgan';
import cors from './middleware/cors.js';
import apiRouter from './api/routes/index.js';
import * as errors from './middleware/errors.js';

const app = express();
    
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors);
app.use(apiRouter);
app.use(errors.notFound);
app.use(errors.converter);
app.use(errors.handler);

export default app;
