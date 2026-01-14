import express from 'express';
import { AssignmentControllers } from './assignment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { AssignmentValidations } from './assignment.validation';
import { multerUpload } from '../../utils/multerUpload';
import { parseBody } from '../../middlewares/bodyParser';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.student, USER_ROLE.teacher, USER_ROLE.admin),
    multerUpload.array('thumbnails', 5),
    parseBody,
    validateRequest(AssignmentValidations.createAssignmentValidationSchema),
    AssignmentControllers.createAssignment
);
router.get('/', AssignmentControllers.getAllAssignments);
router.get('/:id', auth(USER_ROLE.student, USER_ROLE.teacher, USER_ROLE.admin), AssignmentControllers.getSingleAssignment);
router.delete('/:id', auth(USER_ROLE.student, USER_ROLE.teacher, USER_ROLE.admin), AssignmentControllers.deleteAssignment);
router.put(
    '/:id',
    auth(USER_ROLE.student, USER_ROLE.teacher, USER_ROLE.admin),
    multerUpload.array('thumbnails', 5),
    parseBody,
    validateRequest(AssignmentValidations.updateAssignmentValidationSchema),
    AssignmentControllers.updateAssignment
);

export const AssignmentRoutes = router;
