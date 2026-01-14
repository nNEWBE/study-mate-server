import express from 'express';
import { WishlistControllers } from './wishlist.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { WishlistValidations } from './wishlist.validation';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.student, USER_ROLE.teacher, USER_ROLE.admin),
    validateRequest(WishlistValidations.addToWishlistValidationSchema),
    WishlistControllers.addToWishlist
);

router.get(
    '/',
    auth(USER_ROLE.student, USER_ROLE.teacher, USER_ROLE.admin),
    WishlistControllers.getMyWishlist
);

router.delete(
    '/:id',
    auth(USER_ROLE.student, USER_ROLE.teacher, USER_ROLE.admin),
    WishlistControllers.removeFromWishlist
);

export const WishlistRoutes = router;
