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

// Recycle Bin Routes - Admin only
router.get(
    '/recycle-bin',
    auth(USER_ROLE.admin),
    CategoryControllers.getDeletedCategories
);

router.patch(
    '/recycle-bin/:id/restore',
    auth(USER_ROLE.admin),
    CategoryControllers.restoreCategory
);

router.delete(
    '/recycle-bin/:id/permanent',
    auth(USER_ROLE.admin),
    CategoryControllers.permanentDeleteCategory
);

export const CategoryRoutes = router;
