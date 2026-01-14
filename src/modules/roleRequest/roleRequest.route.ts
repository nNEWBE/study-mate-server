import express from 'express';
import { RoleRequestControllers } from './roleRequest.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { RoleRequestValidations } from './roleRequest.validation';

const router = express.Router();

// Student/Teacher can request a role upgrade
router.post(
    '/',
    auth(USER_ROLE.student, USER_ROLE.teacher),
    validateRequest(RoleRequestValidations.createRoleRequestValidationSchema),
    RoleRequestControllers.createRoleRequest
);

// User can view their own requests
router.get(
    '/my-requests',
    auth(USER_ROLE.student, USER_ROLE.teacher, USER_ROLE.admin),
    RoleRequestControllers.getMyRoleRequests
);

// Admin can view all requests
router.get(
    '/',
    auth(USER_ROLE.admin),
    RoleRequestControllers.getAllRoleRequests
);

// Admin can approve/reject requests
router.patch(
    '/:id',
    auth(USER_ROLE.admin),
    validateRequest(RoleRequestValidations.updateRoleRequestValidationSchema),
    RoleRequestControllers.updateRoleRequest
);

export const RoleRequestRoutes = router;
