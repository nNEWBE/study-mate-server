import { Category } from './category.model';
import { TCategory } from './category.interface';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { IImageFile } from '../../interface/ImageFile';

const createCategory = async (payload: TCategory, file?: IImageFile) => {
    // Upload image to Cloudinary if provided
    if (file && file.path) {
        const imageUrl = await uploadToCloudinary(file.path, 'study-mate/categories');
        payload.imageUrl = imageUrl;
    }

    const result = await Category.create(payload);
    return result;
};

import QueryBuilder from "../../builder/QueryBuilder";

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
    if (file && file.path) {
        const imageUrl = await uploadToCloudinary(file.path, 'study-mate/categories');
        payload.imageUrl = imageUrl;
    }

    const result = await Category.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

const deleteCategory = async (id: string) => {
    const result = await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
};

export const CategoryServices = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
