import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import fs from 'fs';

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name as string,
    api_key: config.cloudinary_api_key as string,
    api_secret: config.cloudinary_api_secret as string,
});

export const uploadToCloudinary = async (
    filePath: string,
    folder: string = 'study-mate'
): Promise<string> => {
    const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        resource_type: 'image',
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    return result.secure_url;
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
