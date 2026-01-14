import { Category } from './category.model';
import { TCategory } from './category.interface';

const createCategory = async (payload: TCategory) => {
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

const updateCategory = async (id: string, payload: Partial<TCategory>) => {
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
