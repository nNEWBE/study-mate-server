import express from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { UserValidations } from '../user/user.validation';
import { multerUpload } from '../../utils/multerUpload';
import { parseBody } from '../../middlewares/bodyParser';

const router = express.Router();

router.post(
    '/register',
    validateRequest(UserValidations.registerUserValidationSchema),
    AuthControllers.registerUser
);
router.post(
    '/login',
    validateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser
);
router.post(
    '/refresh-token',
    validateRequest(AuthValidation.refreshTokenValidationSchema),
    AuthControllers.refreshToken
);
router.post('/logout', AuthControllers.logoutUser);
router.post('/social-login', AuthControllers.socialLogin);

export const AuthRoutes = router;
