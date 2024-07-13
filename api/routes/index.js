import express from 'express';
import usersRoutes from './usersRoutes.js';
import productsRoutes from './productsRoutes.js';

const router = express.Router();

router.use('/api/v1', [usersRoutes, productsRoutes]);

export default router;
