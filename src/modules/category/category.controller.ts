import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';
import { IImageFile } from '../../interface/ImageFile';

const createCategory = catchAsync(async (req, res) => {
    const file = req.file as IImageFile | undefined;
    const result = await CategoryServices.createCategory(req.body, file);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Category created successfully',
        data: result,
    });
});

const getAllCategories = catchAsync(async (req, res) => {
    const result = await CategoryServices.getAllCategories(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Categories retrieved successfully',
        data: result,
    });
});

const getSingleCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CategoryServices.getSingleCategory(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category retrieved successfully',
        data: result,
    });
});

const updateCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const file = req.file as IImageFile | undefined;
    const result = await CategoryServices.updateCategory(id as string, req.body, file);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category updated successfully',
        data: result,
    });
});

const deleteCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CategoryServices.deleteCategory(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category deleted successfully',
        data: result,
    });
});

// Get deleted categories (Recycle Bin) - Admin only
const getDeletedCategories = catchAsync(async (req, res) => {
    const result = await CategoryServices.getDeletedCategories(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Deleted categories retrieved successfully',
        data: result,
    });
});

// Restore a deleted category - Admin only
const restoreCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CategoryServices.restoreCategory(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category restored successfully',
        data: result,
    });
});

// Permanently delete a category - Admin only
const permanentDeleteCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CategoryServices.permanentDeleteCategory(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category permanently deleted',
        data: result,
    });
});

export const CategoryControllers = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    getDeletedCategories,
    restoreCategory,
    permanentDeleteCategory,
};
