import { model, Schema } from "mongoose";
import { TWishlist } from "./wishlist.interface";

const wishlistSchema = new Schema<TWishlist>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignment: {
        type: Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true,
    },
}, {
    timestamps: true,
});

wishlistSchema.index({ user: 1, assignment: 1 }, { unique: true });

export const Wishlist = model<TWishlist>('Wishlist', wishlistSchema);
