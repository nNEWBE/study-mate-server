import express from 'express';
import { AssignmentControllers } from './assignment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { AssignmentValidations } from './assignment.validation';
import { multerUpload } from '../../utils/multerUpload';
import { parseBody } from '../../middlewares/bodyParser';

const router = express.Router();

// Public routes
router.get('/', AssignmentControllers.getAllAssignments);
router.get('/best', AssignmentControllers.getBestAssignments);

// Add Review
router.post(
    '/:id/review',
    auth(USER_ROLE.student, USER_ROLE.teacher, USER_ROLE.admin),
    validateRequest(AssignmentValidations.addReviewValidationSchema),
    AssignmentControllers.addReview
);

// Protected routes
router.post(
    '/',
    auth(USER_ROLE.student, USER_ROLE.teacher, USER_ROLE.admin),
    multerUpload.array('thumbnails', 5),
    parseBody,
    validateRequest(AssignmentValidations.createAssignmentValidationSchema),
    AssignmentControllers.createAssignment
);

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

// Admin only route - toggle best assignment
router.patch(
    '/:id/best',
    auth(USER_ROLE.admin),
    AssignmentControllers.toggleBestAssignment
);

// Recycle Bin Routes - Admin only
router.get(
    '/recycle-bin',
    auth(USER_ROLE.admin),
    AssignmentControllers.getDeletedAssignments
);

router.patch(
    '/recycle-bin/:id/restore',
    auth(USER_ROLE.admin),
    AssignmentControllers.restoreAssignment
);

router.delete(
    '/recycle-bin/:id/permanent',
    auth(USER_ROLE.admin),
    AssignmentControllers.permanentDeleteAssignment
);

export const AssignmentRoutes = router;
