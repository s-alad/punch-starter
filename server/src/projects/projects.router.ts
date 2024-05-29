import express from 'express';
import * as projectcontroller from './projects.controller';
import { middleware } from '../middleware/middleware';
const router = express.Router();

/* router.use(middleware); */
router.get('/get-projects', projectcontroller.getprojects);

export default router;
