import { Category } from './category.model';
import { TCategory } from './category.interface';

const createCategory = async (payload: TCategory) => {
    const result = await Category.create(payload);
    return result;
};

const getAllCategories = async () => {
    const result = await Category.find({ isDeleted: false });
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
