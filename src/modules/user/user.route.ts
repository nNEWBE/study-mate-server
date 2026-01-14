import { Router } from "express";
import { UserController } from "./user.controller";
import { UserValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { parseBody } from "../../middlewares/bodyParser";
import validateRequest from "../../middlewares/validateRequest";
import { multerUpload } from "../../utils/multerUpload";

const router = Router();

router.get('/', UserController.getAllUsers)

router.patch('/update-user/:id',
    multerUpload.single('profileImage'),
    parseBody, validateRequest(UserValidations.updateUserValidationSchema), UserController.updateUser)

router.patch('/change-status/:id', validateRequest(UserValidations.blockUserValidationSchema), UserController.blockUser)
router.get('/me', auth(USER_ROLE.admin, USER_ROLE.user), UserController.getMe)

export const UserRoutes = router
