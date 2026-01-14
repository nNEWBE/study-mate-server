import express from 'express';
import { CategoryControllers } from './category.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidations } from './category.validation';
import { multerUpload } from '../../utils/multerUpload';
import { parseBody } from '../../middlewares/bodyParser';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.admin),
    multerUpload.single('image'),
    parseBody,
    validateRequest(CategoryValidations.createCategoryValidationSchema),
    CategoryControllers.createCategory
);

router.get('/', CategoryControllers.getAllCategories);

router.get('/:id', CategoryControllers.getSingleCategory);

router.patch(
    '/:id',
    auth(USER_ROLE.admin),
    multerUpload.single('image'),
    parseBody,
    validateRequest(CategoryValidations.updateCategoryValidationSchema),
    CategoryControllers.updateCategory
);

router.delete('/:id', auth(USER_ROLE.admin), CategoryControllers.deleteCategory);

export const CategoryRoutes = router;
