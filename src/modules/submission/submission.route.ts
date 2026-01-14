import express from 'express';
import { SubmissionControllers } from './submission.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/', auth(USER_ROLE.student), SubmissionControllers.createSubmission);
router.get('/', auth(USER_ROLE.admin, USER_ROLE.teacher), SubmissionControllers.getAllSubmissions);
router.get('/my-submissions', auth(USER_ROLE.student), SubmissionControllers.getMySubmissions);
router.get('/:id', auth(USER_ROLE.admin, USER_ROLE.teacher, USER_ROLE.student), SubmissionControllers.getSingleSubmission);
router.patch('/:id', auth(USER_ROLE.admin, USER_ROLE.teacher), SubmissionControllers.updateSubmission);

export const SubmissionRoutes = router;
