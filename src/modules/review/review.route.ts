import express from 'express';
import { ReviewControllers } from './review.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidations } from './review.validation';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.student, USER_ROLE.teacher, USER_ROLE.admin),
    validateRequest(ReviewValidations.createReviewValidationSchema),
    ReviewControllers.createReview
);

router.get('/', ReviewControllers.getAllReviews);

export const ReviewRoutes = router;
