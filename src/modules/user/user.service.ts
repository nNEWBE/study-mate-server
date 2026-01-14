import { IImageFile } from "../../interface/ImageFile";
import { User } from "./user.model";
import { checkBlockUser, isUserExistsAndNotBlocked } from "./user.utils";
import { uploadToCloudinary } from "../../utils/cloudinary";

import QueryBuilder from "../../builder/QueryBuilder";

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(User.find(), query)
        .search(['name', 'email'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await userQuery.modelQuery;
    return result;
};

const updateUserFromDB = async (id: string, body: Record<string, unknown>, file: IImageFile) => {
    const user = await User.isUserExistsById(id);
    isUserExistsAndNotBlocked(user);
    if (file && file.path) {
        // Upload to Cloudinary and get URL
        const cloudinaryUrl = await uploadToCloudinary(file.path, 'study-mate/profiles');
        body.profileImage = cloudinaryUrl;
    }
    const result = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    return result;
};

const blockUserFromDB = async (id: string, isBlocked: boolean) => {
    const user = await User.isUserExistsById(id);
    checkBlockUser(user, isBlocked);
    const result = await User.findByIdAndUpdate(id, { isBlocked }, { new: true });
    return result;
};

const getMe = async (id: string) => {
    const result = await User.isUserExistsByEmail(id);
    return result;
}

export const UserServices = {
    getAllUsersFromDB,
    updateUserFromDB,
    blockUserFromDB,
    getMe
};
