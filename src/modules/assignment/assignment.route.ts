import express from 'express';
import { AssignmentControllers } from './assignment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/', auth(USER_ROLE.student, USER_ROLE.teacher), AssignmentControllers.createAssignment);
router.get('/', AssignmentControllers.getAllAssignments);
router.get('/:id', auth(USER_ROLE.student, USER_ROLE.teacher), AssignmentControllers.getSingleAssignment);
router.delete('/:id', auth(USER_ROLE.student, USER_ROLE.teacher), AssignmentControllers.deleteAssignment);
router.put('/:id', auth(USER_ROLE.student, USER_ROLE.teacher), AssignmentControllers.updateAssignment);

export const AssignmentRoutes = router;
