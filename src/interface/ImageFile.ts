export interface IImageFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    // Memory storage (serverless)
    buffer: Buffer;
    // Disk storage (optional - not available in serverless)
    destination?: string;
    filename?: string;
    path?: string;
}
