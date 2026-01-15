import multer from 'multer';

// Use memory storage for serverless environments (Vercel, AWS Lambda, etc.)
// Files are stored in memory as Buffer objects instead of being written to disk
const storage = multer.memoryStorage();

export const multerUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});
