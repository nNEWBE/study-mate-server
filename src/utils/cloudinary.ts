import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name as string,
    api_key: config.cloudinary_api_key as string,
    api_secret: config.cloudinary_api_secret as string,
});

/**
 * Upload a buffer to Cloudinary
 * Works with memory storage (for serverless environments like Vercel)
 */
export const uploadToCloudinary = async (
    buffer: Buffer,
    folder: string = 'study-mate'
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image',
            },
            (error, result: UploadApiResponse | undefined) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(new Error('Upload failed: No result returned'));
                }
            }
        );

        // Write buffer to the upload stream
        uploadStream.end(buffer);
    });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
