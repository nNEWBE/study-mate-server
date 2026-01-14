import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const multerUpload = multer({ storage: storage });
