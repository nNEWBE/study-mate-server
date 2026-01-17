import { model, Schema } from 'mongoose';
import { TCategory } from './category.interface';

const categorySchema = new Schema(
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
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

// Query Middleware to filter out deleted documents
categorySchema.pre('find', function () {
    this.where({ isDeleted: { $ne: true } });
});

categorySchema.pre('findOne', function () {
    this.where({ isDeleted: { $ne: true } });
});

categorySchema.pre('aggregate', function () {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});

// Index for soft delete queries
categorySchema.index({ isDeleted: 1, deletedAt: 1 });

export const Category = model<TCategory>('Category', categorySchema);
