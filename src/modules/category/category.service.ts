import { Category } from './category.model';
import { TCategory } from './category.interface';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { IImageFile } from '../../interface/ImageFile';
import QueryBuilder from "../../builder/QueryBuilder";
import { Assignment } from '../assignment/assignment.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createCategory = async (payload: TCategory, file?: IImageFile) => {
    // Upload image to Cloudinary if provided
    if (file && file.buffer) {
        const imageUrl = await uploadToCloudinary(file.buffer, 'study-mate/categories');
        payload.imageUrl = imageUrl;
    }

    const result = await Category.create(payload);
    return result;
};

const getAllCategories = async (query: Record<string, unknown>) => {
    const categoryQuery = new QueryBuilder(Category.find({ isDeleted: false }), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await categoryQuery.modelQuery;
    return result;
};

const getSingleCategory = async (id: string) => {
    const result = await Category.findById(id);
    return result;
};

const updateCategory = async (id: string, payload: Partial<TCategory>, file?: IImageFile) => {
    // Upload new image to Cloudinary if provided
    if (file && file.buffer) {
        const imageUrl = await uploadToCloudinary(file.buffer, 'study-mate/categories');
        payload.imageUrl = imageUrl;
    }

    const result = await Category.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

const deleteCategory = async (id: string) => {
    // Check if any assignments are using this category
    const assignmentsCount = await Assignment.countDocuments({ categoryId: id });

    if (assignmentsCount > 0) {
        throw new AppError(
            'categoryId',
            httpStatus.BAD_REQUEST,
            `Cannot delete category. There are ${assignmentsCount} assignment(s) using this category. Please delete or reassign the assignments first.`
        );
    }

    const result = await Category.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
    return result;
};

// Get deleted categories (Recycle Bin) - Admin only
const getDeletedCategories = async (query: Record<string, unknown>) => {
    // First, permanently delete items older than 30 days
    await cleanupExpiredDeletedCategories();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Category.find({ isDeleted: true, deletedAt: { $gte: thirtyDaysAgo } });
    return result;
};

// Restore a deleted category - Admin only
const restoreCategory = async (id: string) => {
    const category = await Category.findOne({ _id: id, isDeleted: true });
    if (!category) {
        throw new AppError('categoryId', httpStatus.NOT_FOUND, 'Deleted category not found');
    }

    const result = await Category.findByIdAndUpdate(
        id,
        { isDeleted: false, $unset: { deletedAt: 1 } },
        { new: true }
    );
    return result;
};

// Permanently delete a category - Admin only
const permanentDeleteCategory = async (id: string) => {
    const category = await Category.findOne({ _id: id, isDeleted: true });
    if (!category) {
        throw new AppError('categoryId', httpStatus.NOT_FOUND, 'Deleted category not found');
    }

    const result = await Category.findByIdAndDelete(id);
    return result;
};

// Cleanup: Permanently delete categories that have been in recycle bin for more than 30 days
const cleanupExpiredDeletedCategories = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await Category.deleteMany({
        isDeleted: true,
        deletedAt: { $lt: thirtyDaysAgo }
    });
};

export const CategoryServices = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    getDeletedCategories,
    restoreCategory,
    permanentDeleteCategory,
    cleanupExpiredDeletedCategories,
};
