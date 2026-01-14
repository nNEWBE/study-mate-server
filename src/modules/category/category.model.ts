import { model, Schema } from 'mongoose';
import { TCategory } from './category.interface';

const categorySchema = new Schema<TCategory>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Category = model<TCategory>('Category', categorySchema);
