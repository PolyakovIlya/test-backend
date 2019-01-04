import { Router } from 'express';
import users from './users';
import articles from './articles';
import suggestions from './suggestions';

const router = Router();

router.use('/', users);
router.use('/articles', articles);
router.use('/suggestions', suggestions);

export default router;
