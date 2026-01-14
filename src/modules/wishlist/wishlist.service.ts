import { TWishlist } from "./wishlist.interface";
import { Wishlist } from "./wishlist.model";

const addToWishlist = async (payload: TWishlist) => {
    // Check if already exists is handled by unique index in model
    const result = await Wishlist.create(payload);
    return result;
};

const getMyWishlist = async (userId: string) => {
    const result = await Wishlist.find({ user: userId }).populate('assignment');
    return result;
};

const removeFromWishlist = async (id: string, userId: string) => {
    // Ensure the user owns the wishlist item
    const result = await Wishlist.findOneAndDelete({ _id: id, user: userId });
    return result;
};

export const WishlistServices = {
    addToWishlist,
    getMyWishlist,
    removeFromWishlist,
};
