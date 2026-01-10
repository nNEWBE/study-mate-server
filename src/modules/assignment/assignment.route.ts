import express from 'express';
import { AssignmentControllers } from './assignment.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/assignment', auth, AssignmentControllers.createAssignment);
router.get('/assignments', AssignmentControllers.getAllAssignments);
router.get('/assignment/:id', auth, AssignmentControllers.getSingleAssignment);
router.delete('/assignment/:id', auth, AssignmentControllers.deleteAssignment);
router.put('/assignment/:id', auth, AssignmentControllers.updateAssignment);

export const AssignmentRoutes = router;
