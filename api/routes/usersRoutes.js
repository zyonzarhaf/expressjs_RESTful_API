import express from 'express';

import { verifyToken, ensureCredentials } from '../../middleware/auth.js';
import { registerRules, updateRules, loginRules } from '../../utils/validationRules.js';

import validate from '../../middleware/validate.js';

import { 
    get,
    list,
    update,
    remove,
    register,
    login,
    logout
} from '../controllers/usersController.js';

const router = express.Router();

// CHANGED: merged the ensureUser and ensureAdmin into a single middleware
// refactor validation middleware
// changed the import statements
router
.route('/users/:userId')
.get(verifyToken, ensureCredentials, get)
.put(verifyToken, ensureCredentials, validate(updateRules), update)
.delete(verifyToken, ensureCredentials, remove);

router.get('/users', verifyToken, ensureCredentials, list);
router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);
router.delete('/logout', logout);

export default router;
